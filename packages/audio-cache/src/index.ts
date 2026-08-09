/*
 * Persistent cache for the sound files, backed by IndexedDB. Shared by every app
 * in the workspace.
 *
 * IndexedDB (rather than the Cache Storage API) because it also works in Safari
 * Lockdown Mode, stores Blobs natively (no base64, unlike localStorage), and has
 * a large quota. Entries live until the user clears the cache — there is no TTL,
 * and nothing is revalidated against the server.
 *
 * So a recording *replaced* at a url it already occupies would be invisible to
 * anyone holding the old one: idbGet returns whatever was stored first, forever.
 * Each app passes a `cacheVersion` to say "the files changed" — see below.
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
 *
 * `cacheVersion` is the app's answer to "have any of my sound files changed under
 * a url that stayed the same?". Raise it whenever a file under `public/sound/` is
 * re-recorded, re-encoded or trimmed: it is the IndexedDB version, so opening at a
 * higher number fires onupgradeneeded, which drops the store and re-fetches
 * everything once. Adding or removing a sound needs no raise — a new url is simply
 * a miss, and a dropped one is an entry nobody reads.
 *
 * The cost of raising it is one full re-download for anyone who had the sounds.
 * That only ever happens online: there is no service worker, so an offline user
 * keeps the old build, the old number and an intact cache, and re-downloads when
 * they next load the app with a connection.
 */
export function createAudioCache(dbName: string, cacheVersion: number): AudioCache {
	let dbPromise: Promise<IDBDatabase> | null = null

	function openDb(): Promise<IDBDatabase> {
		if (dbPromise) return dbPromise
		dbPromise = new Promise((resolve, reject) => {
			if (typeof indexedDB === 'undefined') {
				reject(new Error('IndexedDB unavailable'))
				return
			}
			const req = indexedDB.open(dbName, cacheVersion)
			req.onupgradeneeded = () => {
				const db = req.result
				// A raise means files changed under urls that did not, so there is no
				// way to tell which entries went stale and nothing worth keeping.
				if (db.objectStoreNames.contains(STORE)) db.deleteObjectStore(STORE)
				db.createObjectStore(STORE)
			}
			req.onsuccess = () => {
				const db = req.result
				// Another tab is upgrading: let go so it can, and drop this handle so
				// the next call reopens at the new version.
				db.onversionchange = () => {
					db.close()
					dbPromise = null
				}
				resolve(db)
			}
			// An older tab still holds the database at the previous version, so the
			// upgrade cannot run. Fail soft — playback falls back to the network — and
			// forget the attempt so a later call can retry once that tab has gone.
			req.onblocked = () => {
				dbPromise = null
				reject(new Error(`IndexedDB upgrade of ${dbName} blocked by another tab`))
			}
			req.onerror = () => {
				dbPromise = null
				reject(req.error)
			}
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
