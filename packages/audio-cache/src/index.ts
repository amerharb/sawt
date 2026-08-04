/*
 * Persistent cache for the sound files, backed by IndexedDB. Shared by every app
 * in the workspace.
 *
 * IndexedDB (rather than the Cache Storage API) because it also works in Safari
 * Lockdown Mode, stores Blobs natively (no base64, unlike localStorage), and has
 * a large quota. Entries live until the user clears the cache — there is no TTL.
 *
 * All helpers fail soft: if IndexedDB is unavailable, reads/writes are skipped and
 * playback falls back to the network (getAudioBlob).
 *
 * Each app owns its own database, named when it calls `createAudioCache`. The apps
 * are served from separate subdomains, so in production they are separate origins
 * and could not share storage anyway — but during development they all run on
 * localhost, where a shared name would mean one app's 🗑️ clearing another's sounds.
 */

const STORE = 'sounds'

export type AudioCache = {
	/** the cached blob for a url, or undefined */
	idbGet: (url: string) => Promise<Blob | undefined>,
	/** whether a url is already cached, without reading the blob */
	idbHas: (url: string) => Promise<boolean>,
	idbPut: (url: string, blob: Blob) => Promise<void>,
	/** how many sounds are cached (shown next to 🔊 in settings) */
	idbCount: () => Promise<number>,
	/** empty the cache (the 🗑️ button) */
	idbClear: () => Promise<void>,
	/** the sound as a Blob: cache first, else network, storing what it fetches */
	getAudioBlob: (url: string) => Promise<Blob | null>,
	/** make sure every url is cached, fetching only the missing ones (✈️) */
	ensureCached: (urls: string[]) => Promise<void>,
}

/**
 * Build a cache backed by its own IndexedDB database.
 *
 * `dbName` must be unique per app — see the note above on why sharing one bites
 * during development.
 */
export function createAudioCache(dbName: string): AudioCache {
	let dbPromise: Promise<IDBDatabase> | null = null

	function openDb(): Promise<IDBDatabase> {
		if (dbPromise) return dbPromise
		dbPromise = new Promise((resolve, reject) => {
			if (typeof indexedDB === 'undefined') {
				reject(new Error('IndexedDB unavailable'))
				return
			}
			const req = indexedDB.open(dbName, 1)
			req.onupgradeneeded = () => req.result.createObjectStore(STORE)
			req.onsuccess = () => resolve(req.result)
			req.onerror = () => reject(req.error)
		})
		return dbPromise
	}

	function run<T>(mode: IDBTransactionMode, op: (store: IDBObjectStore) => IDBRequest): Promise<T> {
		return openDb().then(db => new Promise<T>((resolve, reject) => {
			const tx = db.transaction(STORE, mode)
			const req = op(tx.objectStore(STORE))
			req.onsuccess = () => resolve(req.result as T)
			req.onerror = () => reject(req.error)
		}))
	}

	const idbGet = (url: string) => run<Blob | undefined>('readonly', s => s.get(url))

	const idbHas = (url: string) =>
		run<IDBValidKey | undefined>('readonly', s => s.getKey(url)).then(k => k !== undefined)

	const idbPut = (url: string, blob: Blob) =>
		run('readwrite', s => s.put(blob, url)).then(() => undefined)

	const idbCount = () => run<number>('readonly', s => s.count())

	const idbClear = () => run('readwrite', s => s.clear()).then(() => undefined)

	async function getAudioBlob(url: string): Promise<Blob | null> {
		try {
			const cached = await idbGet(url)
			if (cached) return cached
		} catch {
			// IndexedDB unavailable — fall through to the network
		}
		try {
			const res = await fetch(url)
			if (!res.ok) return null
			const blob = await res.blob()
			if (blob.size === 0) return null
			idbPut(url, blob).catch(() => {}) // best-effort persist; don't block playback
			return blob
		} catch (e) {
			console.error(`Failed to fetch ${url}:`, e)
			return null
		}
	}

	async function ensureCached(urls: string[]): Promise<void> {
		await Promise.all(urls.map(async url => {
			let has = false
			try {
				has = await idbHas(url)
			} catch {
				// IndexedDB unavailable — try to fetch+store anyway (store may still fail)
			}
			if (has) return
			try {
				const res = await fetch(url)
				if (!res.ok) {
					console.warn(`Failed to cache: ${url} (status: ${res.status})`)
					return
				}
				const blob = await res.blob()
				if (blob.size > 0) {
					await idbPut(url, blob).catch(() => {})
				}
			} catch (err) {
				console.error(`Error fetching ${url}:`, err)
			}
		}))
	}

	return { idbGet, idbHas, idbPut, idbCount, idbClear, getAudioBlob, ensureCached }
}
