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
 * was. Nothing turns on by itself in dev builds either. A third condition
 * joins them at runtime — the server has to be at least `MIN_SAHA_VERSION`,
 * see below.
 *
 * The server deals only in item codes. Every client speaks the target itself,
 * in its own selected language, from its own cached sounds — which is what
 * lets a child hearing Arabic and a child hearing Swedish race the same
 * round. Nothing a child types ever reaches another child: an avatar is a
 * position in a list the server owns, and the only thing anyone types is the
 * six digits of a room they were told, which are checked against the rooms
 * that exist before they reach one.
 *
 * Unless the host says otherwise. A room can be held to one sound — the
 * host's own — which turns the same board into a different game: not "find
 * the red one" in the language you know, but "find the red one" in the
 * language everybody is being taught. The room's `sound` is then the id the
 * host declared, and every client plays and shows that one instead of its
 * own. An id this build does not recognise is ignored rather than trusted, so
 * a room can never make an app fetch a sound it has no name for.
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
 * The oldest saha this build can play against.
 *
 * saha's paths are not versioned per wire change — see its README on why `/v1`
 * is a namespace rather than a promise — so this number is what stands in for
 * that. It is the *client's* requirement, so it moves only when this code
 * starts depending on something a server has to have, not on every saha
 * release:
 *
 *   0.2.0  `done` carries who won each card
 *   0.3.0  a room can be held to one sound
 *   0.4.0  six-digit room codes, and no room-emoji palette
 *
 * What it prevents is a mis-ordered deploy. Against an older server the
 * courtyard is not half-broken and mysterious — the join keypad drawn from a
 * palette that no longer comes, a code every room refuses — it is simply
 * absent, which is the same thing the app already does when saha is down.
 */
export const MIN_SAHA_VERSION = '0.4.0'

/*
 * Is `version` at least `minimum`? Numerically, field by field, which is the
 * whole point: compared as text `0.10.0` sorts *below* `0.4.0` and a client
 * would refuse a server that is ten releases too new.
 *
 * Anything that is not three numbers counts as too old — a body with no
 * version in it is not a saha this build knows how to talk to, and guessing
 * in its favour is how a mis-ordered deploy becomes a bug report instead of a
 * missing button.
 */
export const atLeast = (version: string, minimum: string): boolean => {
	const fields = (v: string) => v.split('.').map(n => parseInt(n, 10))
	const have = fields(version)
	const need = fields(minimum)
	if (have.length < 3 || have.some(Number.isNaN)) return false
	for (let i = 0; i < 3; i++) {
		if (have[i] !== need[i]) return have[i] > need[i]
	}
	return true
}

/*
 * Is the courtyard up, and new enough? Asked at most every ten minutes and
 * cached either way, exactly as sada's gate works — a server that is down (or
 * behind) costs one aborted request per ten minutes and nothing else.
 * Multiplayer simply does not appear; the app stays the single-player app it
 * has always been.
 *
 * The cache cuts both ways, and it is worth knowing when deploying: a saha
 * that comes good is trusted only once the ten minutes are up, so a reload is
 * the quick way to see a fixed deploy.
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
				if (!res.ok) return false
				const body = await res.json() as { version?: string }
				if (atLeast(body.version ?? '', MIN_SAHA_VERSION)) return true
				/*
				 * A developer's mistake, not a child's — the two repos went out
				 * in the wrong order. Say so once, in the one place someone
				 * looking for it will look.
				 */
				console.warn(
					`saha ${body.version ?? '(no version)'} is older than the `
					+ `${MIN_SAHA_VERSION} this build needs: multiplayer stays off`,
				)
				return false
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
 * The avatar list, fetched once. It belongs to the server — a player is a
 * *position* in it, never a string — so a client that keeps its own copy is a
 * client that will eventually disagree with the room everyone else is in.
 *
 * There used to be a second list here, the animals a room code was spelled in.
 * A code is six digits now, so nothing has to be fetched before a join screen
 * can draw one.
 */
export type Palettes = { avatars: string[] }

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

/** How many digits a room code is. Six, and the leading zeros are part of it. */
export const ROOM_CODE_LEN = 6

/*
 * Every digit this accepts, ASCII first. The others are the same digits on an
 * Arabic or Persian keyboard: a child types ٠٠٤٢٧١ and means the room called
 * 004271, so the two are read as one thing and normalised to ASCII. The server
 * does exactly this again — this copy is only so the screen can say "that is
 * not a room" without a round trip.
 */
const DIGITS = [
	'0123456789',
	'\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669',
	'\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9',
]

/** One character as the ASCII digit it means, or '' if it is not a digit. */
export const asDigit = (ch: string): string => {
	for (const set of DIGITS) {
		const at = set.indexOf(ch)
		if (at >= 0) return String(at)
	}
	return ''
}

/**
 * Every digit in `value`, in order, as ASCII — spaces, dashes and anything
 * else dropped. What a keypad, a keyboard and a paste all funnel through.
 */
export const digitsOf = (value: string): string =>
	[...value].map(asDigit).join('')

/*
 * Six digits, or nothing. Mirrors the server's own rule, including the leading
 * zeros: `004271` is a code and `4271` is not, because a code is six characters
 * rather than a number that happens to be small.
 */
export const readRoomCode = (value: string): string | null => {
	const digits = digitsOf(value)
	return digits.length === ROOM_CODE_LEN ? digits : null
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
	/*
	 * The sound the room is held to, or null when everybody hears their own.
	 * It is here, before the socket, because it can be a reason not to go in:
	 * a child deserves to know they are about to race in a language they are
	 * still learning while backing out is free.
	 */
	sound: string | null,
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

/** A card that is over, and whose it is. */
export type Resolved = { code: string, by: string | null }

export type RaceSnapshot = {
	/** six digits as a string, leading zeros and all — never a number */
	room: string,
	app: string,
	phase: 'lobby' | 'dealing' | 'playing' | 'finished',
	hostId: string,
	epoch: number,
	/*
	 * The sound in force: the host's between rounds, the round's own once a
	 * board is dealt (so a child who reloads mid-race hears what the others
	 * are hearing), and null when everybody plays in their own.
	 */
	sound: string | null,
	players: RacePlayer[],
	board: string[],
	total: number,
	/*
	 * The cards already settled, in the order they went, each with whoever won
	 * it — `by: null` where the room gave it up instead. The winner travels
	 * with the card rather than only in the `scored` that announced it,
	 * because a client that arrives late has heard none of those and still has
	 * to draw the board everyone else is looking at.
	 */
	done: Resolved[],
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
	| { type: 'deal', epoch: number, board: string[], total: number, sound: string | null }
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
	| { type: 'create', app: string, codes: string[], roundSize: number, avatar: number, sound?: string }
	| { type: 'join', room: string, codes: string[], avatar: number, sound?: string }
	| { type: 'resume', room: string, playerId: string, token: string }
	| { type: 'start' }
	/*
	 * Host only, between rounds: hold the room to my sound, or let go of it.
	 * There is no field for *which* — it is always the host's own, which is the
	 * only sound the server knows a board can safely be dealt for.
	 */
	| { type: 'enforce', on: boolean }
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
