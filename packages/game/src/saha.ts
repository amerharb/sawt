/*
 * saha (ساحة — the courtyard): the multiplayer server's client side.
 *
 * Where sada listens, saha answers: it holds a room of children playing the
 * same round, announces one target at a time, and gives each one to the first
 * correct tap. This module is the wire — the configuration, the message
 * shapes, and the two things a join screen needs before any socket exists.
 * The room itself lives in useRace.
 *
 * Env, set per deployment (e.g. in Vercel) or in a local .env.local:
 *   VITE_SAHA_ENABLED=true                the on/off switch (default: off)
 *   VITE_SAHA_URL=https://saha.sawt.info  the courtyard's base URL
 *
 * Both are required, exactly as with sada: a missing switch, a missing URL or
 * a malformed one leaves multiplayer invisible, and the app is what it always
 * was. Nothing turns on by itself in dev builds either.
 *
 * The server deals only in item codes. Every client speaks the target itself,
 * in its own selected language, from its own cached sounds — which is what
 * lets a child hearing Arabic and a child hearing Swedish race the same
 * round. Nothing a child types ever reaches another child, because there is
 * nothing to type into: avatars and room codes are emoji chosen from lists
 * the server owns.
 */

export type SahaConfig = {
	// true only when the switch is set AND the URL is usable
	enabled: boolean,
	// base URL without a trailing slash; empty string when disabled
	baseUrl: string,
}

const raw = (import.meta.env.VITE_SAHA_URL ?? '').trim().replace(/\/+$/, '')
const wellFormed = /^https?:\/\/[^\s/]+/.test(raw)

export const SAHA: SahaConfig = {
	enabled: import.meta.env.VITE_SAHA_ENABLED === 'true' && wellFormed,
	baseUrl: wellFormed ? raw : '',
}

/** The socket, derived from the base URL: http → ws, https → wss. */
export const socketUrl = (): string => `${SAHA.baseUrl.replace(/^http/, 'ws')}/v1/ws`

// how long one health verdict — up or down — is trusted
const HEALTH_TTL_MS = 10 * 60 * 1000
const HEALTH_TIMEOUT_MS = 4000

let health: { ok: boolean, at: number } = { ok: false, at: -Infinity }
let probing: Promise<boolean> | null = null

/*
 * Is the courtyard up? Asked at most every ten minutes and cached either way,
 * exactly as sada's gate works — a server that is down costs one aborted
 * request per ten minutes and nothing else. Multiplayer simply does not
 * appear; the app stays the single-player app it has always been.
 */
export async function sahaHealthy(): Promise<boolean> {
	if (!SAHA.enabled) return false
	if (Date.now() - health.at < HEALTH_TTL_MS) return health.ok
	probing ??= (async () => {
		const ok = await (async () => {
			try {
				const signal = typeof AbortSignal.timeout === 'function'
					? AbortSignal.timeout(HEALTH_TIMEOUT_MS)
					: undefined
				const res = await fetch(`${SAHA.baseUrl}/health`, { signal })
				return res.ok
			} catch {
				return false
			}
		})()
		health = { ok, at: Date.now() }
		probing = null
		return ok
	})()
	return probing
}

/*
 * The two emoji lists, fetched once. They belong to the server — a room code
 * is four of `roomEmoji` and a player is one of `avatars`, both chosen by
 * position — so a client that keeps its own copy is a client that will
 * eventually disagree with the room everyone else is in.
 */
export type Palettes = { avatars: string[], roomEmoji: string[] }

let palettes: Palettes | null = null
let fetching: Promise<Palettes | null> | null = null

export async function sahaPalettes(): Promise<Palettes | null> {
	if (!SAHA.enabled) return null
	if (palettes) return palettes
	fetching ??= (async () => {
		try {
			const res = await fetch(`${SAHA.baseUrl}/v1/palettes`)
			if (!res.ok) return null
			const body = await res.json() as Palettes
			palettes = body
			return body
		} catch {
			return null
		} finally {
			fetching = null
		}
	})()
	return fetching
}

/** What a code spells in animals, for a room this client has not joined yet. */
export const roomEmojiOf = (code: string, palette: string[]): string =>
	[...code.toUpperCase()]
		.map(ch => palette[ALPHABET.indexOf(ch)] ?? '')
		.join('')

/*
 * The server's alphabet, one letter per palette position. It skips I and O,
 * because a code gets read aloud across a room — which also means position
 * and letter part company after H, so this order is the only way to map one
 * to the other. A code the client builds by tapping animals is turned back
 * into letters here, and the server checks it again anyway.
 */
export const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ'

export const codeOfEmoji = (picked: number[]): string =>
	picked.map(i => ALPHABET[i] ?? '').join('')

/** Four letters of the alphabet, or nothing. Mirrors the server's own rule. */
export const readRoomCode = (value: string): string | null => {
	const up = value.trim().toUpperCase()
	if (up.length !== 4) return null
	return [...up].every(ch => ALPHABET.includes(ch)) ? up : null
}

/*
 * What a join screen may ask before opening a socket: is this code a room,
 * which app is it playing, is it still open, and which animals are already
 * worn. Answers null for anything that is not a live, findable room — a
 * mistyped code and a room that has closed look the same from outside, which
 * is the intent.
 */
export type RoomGlance = {
	room: string,
	app: string,
	phase: 'lobby' | 'dealing' | 'playing' | 'finished',
	players: number,
	joinable: boolean,
	takenAvatars: number[],
}

export async function probeRoom(code: string): Promise<RoomGlance | null> {
	if (!SAHA.enabled) return null
	try {
		const res = await fetch(`${SAHA.baseUrl}/v1/rooms/${code}`)
		if (!res.ok) return null
		return await res.json() as RoomGlance
	} catch {
		return null
	}
}

// ---------------------------------------------------------------- the wire

export type RacePlayer = {
	playerId: string,
	// an index into `Palettes.avatars` — never a string a child chose
	avatar: number,
	connected: boolean,
	score: number,
	mistakes: number,
}

export type RaceSnapshot = {
	room: string,
	roomEmoji: string,
	app: string,
	phase: 'lobby' | 'dealing' | 'playing' | 'finished',
	hostId: string,
	epoch: number,
	players: RacePlayer[],
	board: string[],
	total: number,
	done: string[],
	current: { index: number, code: string } | null,
	wrong: string[],
	lockedForMs: number,
	skipVotes: number,
	skipNeeded: number,
	elapsedMs: number,
	winners: string[],
}

/** Everything the server may say. See saha's README for the whole catalog. */
export type ServerMsg =
	| { type: 'welcome', playerId: string, token: string, avatars: string[], snapshot: RaceSnapshot }
	| { type: 'room', snapshot: RaceSnapshot }
	| { type: 'deal', epoch: number, board: string[], total: number }
	| { type: 'go' }
	| { type: 'target', index: number, code: string }
	| { type: 'wrongTap', playerId: string, code: string, lockedForMs: number, players: RacePlayer[] }
	| { type: 'scored', index: number, code: string, by: string, ms: number, players: RacePlayer[], next: { index: number, inMs: number } | null, elapsedMs: number }
	| { type: 'skipped', index: number, code: string, players: RacePlayer[], next: { index: number, inMs: number } | null, elapsedMs: number }
	| { type: 'skipVotes', votes: number, needed: number }
	| { type: 'roundEnded', players: RacePlayer[], winners: string[], elapsedMs: number }
	| { type: 'error', code: string }
	| { type: 'bye', reason: 'roomClosed' | 'restarting' | 'left' }

/** Everything this client may say. */
export type ClientMsg =
	| { type: 'create', app: string, codes: string[], roundSize: number, avatar: number }
	| { type: 'join', room: string, codes: string[], avatar: number }
	| { type: 'resume', room: string, playerId: string, token: string }
	| { type: 'start' }
	| { type: 'ready', epoch: number }
	| { type: 'tap', code: string }
	| { type: 'skip' }
	| { type: 'leave' }

/*
 * The seat this browser holds: enough to walk back into a room after a
 * dropped socket or a reload, and nothing else. It lives in sessionStorage,
 * so it survives a sleeping tablet but not a closed tab, and it is only ever
 * about this child on this device — no name, no history, no other room.
 */
export type Seat = { room: string, playerId: string, token: string }

const SEAT_KEY = 'saha-seat'

export const rememberSeat = (seat: Seat): void => {
	try {
		sessionStorage.setItem(SEAT_KEY, JSON.stringify(seat))
	} catch {
		// a browser that refuses storage simply cannot resume
	}
}

export const recallSeat = (): Seat | null => {
	try {
		const raw = sessionStorage.getItem(SEAT_KEY)
		if (!raw) return null
		const seat = JSON.parse(raw) as Seat
		return seat.room && seat.playerId && seat.token ? seat : null
	} catch {
		return null
	}
}

export const forgetSeat = (): void => {
	try {
		sessionStorage.removeItem(SEAT_KEY)
	} catch {
		// nothing to forget
	}
}
