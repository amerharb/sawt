/*
 * baab (باب — the door): the authentication service's client side.
 *
 * Where sada listens and saha answers, baab remembers who you are: a
 * passwordless sign-in — an email, a six-digit code or a magic link — and
 * behind it a handle, a nickname and each app's settings, so a player's
 * choices follow them from device to device. This module is the wire: the
 * configuration and one function per thing a page can ask of baab. The
 * session itself lives in useBaab.
 *
 * Env, set per deployment (e.g. in Vercel) or in a local .env.local:
 *   VITE_BAAB_ENABLED=true                the on/off switch (default: off)
 *   VITE_BAAB_URL=https://baab.sawt.info  baab's base URL
 *
 * Both are required, exactly as with sada and saha: a missing switch, a
 * missing URL or a malformed one leaves sign-in invisible, and the app is
 * what it always was. Nothing turns on by itself in dev builds either.
 *
 * There is no health gate here, unlike the other two. The first thing any
 * page asks is "who am I?", and the answer — a profile, a 401, or no answer
 * at all — already says whether baab is up; a gate in front of it would
 * be a second probe for the same fact.
 *
 * Every call carries the cookie (`credentials: 'include'`). Baab sets it
 * for `.sawt.info`, so the browser attaches it to baab.sawt.info from any
 * page under sawt.info — sign in on the landing page and flag.sawt.info is
 * signed in too, with nothing passed between them. JavaScript never reads
 * the cookie; it is httpOnly, and this side only ever sees its effects.
 * Preview builds on *.vercel.app are a different site, so the browser
 * withholds the cookie there and every page runs signed out — by design.
 */

export type BaabConfig = {
	// true only when the switch is set AND the URL is usable
	enabled: boolean,
	// base URL without a trailing slash; empty string when disabled
	baseUrl: string,
}

const raw = (import.meta.env.VITE_BAAB_URL ?? '').trim().replace(/\/+$/, '')
const wellFormed = /^https?:\/\/[^\s/]+/.test(raw)

export const BAAB: BaabConfig = {
	enabled: import.meta.env.VITE_BAAB_ENABLED === 'true' && wellFormed,
	baseUrl: wellFormed ? raw : '',
}

/*
 * What baab knows about a signed-in player. The handle plays the
 * username role — eight Crockford base-32 characters grouped by four,
 * `K7Q4-X2M9`, minted by baab at first sign-in and never edited here.
 * The nickname is decoration, up to 24 characters, null until chosen.
 * Settings are not part of it: each app keeps its own, under
 * /v1/settings/{app} (see fetchAppSettings).
 */
export type Profile = {
	handle: string,
	nickname: string | null,
}

// one app's settings as baab holds them: a JSON object, at most 8 KB
export type SavedSettings = Record<string, unknown>

/*
 * What asking for a code can come to. `wait` is baab's one-mail-a-minute
 * rule: a code is already out for that mailbox and still good, so the page
 * should move on to the code step rather than complain. `refused` is an
 * address baab will not mail at all.
 */
export type Knock = 'sent' | 'wait' | 'refused' | 'down'

/*
 * What spending a code or a link token can come to. `wrong` covers a mistyped
 * code, an expired one, a fifth bad attempt and a link already used —
 * baab does not say which, on purpose, and the page need not either.
 */
export type Entry = 'in' | 'wrong' | 'down'

// baab not answering in this long is down, not slow
const TIMEOUT_MS = 8000

const timeout = () =>
	typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(TIMEOUT_MS) : undefined

const call = (path: string, init: RequestInit = {}): Promise<Response> =>
	fetch(`${BAAB.baseUrl}${path}`, { credentials: 'include', signal: timeout(), ...init })

const json = (body: unknown): RequestInit => ({
	headers: { 'content-type': 'application/json' },
	body: JSON.stringify(body),
})

/*
 * Who is behind the cookie: the profile, or null when nobody is. Throws when
 * baab does not answer (network, timeout, a 5xx) — the caller decides
 * what silence from baab means, and for a page load it means "signed out, for
 * now", never a stored verdict.
 */
export async function fetchProfile(): Promise<Profile | null> {
	if (!BAAB.enabled) return null
	const res = await call('/v1/profile')
	if (res.status === 401) return null
	if (!res.ok) throw new Error(`baab answered ${res.status}`)
	return await res.json() as Profile
}

/*
 * Step one: ask baab to mail a code. `app` is the slug of the asking app
 * (`home` for the landing page), so the magic link in the mail lands back on
 * the page that asked, as `?login=<token>`.
 */
export async function requestCode(email: string, app: string): Promise<Knock> {
	if (!BAAB.enabled) return 'down'
	try {
		const res = await call('/v1/login', { method: 'POST', ...json({ email: email.trim(), app }) })
		if (res.ok) return 'sent'
		if (res.status === 429) return 'wait'
		if (res.status === 422) return 'refused'
		return 'down'
	} catch {
		return 'down'
	}
}

const enter = async (body: unknown): Promise<Entry> => {
	if (!BAAB.enabled) return 'down'
	try {
		const res = await call('/v1/verify', { method: 'POST', ...json(body) })
		if (res.ok) return 'in'
		if (res.status === 401 || res.status === 422) return 'wrong'
		return 'down'
	} catch {
		return 'down'
	}
}

// step two, typed: the six digits that arrived by mail, with the email they went to
export const verifyCode = (email: string, code: string): Promise<Entry> =>
	enter({ email: email.trim(), code: code.trim() })

// step two, clicked: the token the magic link carried back as ?login=
export const verifyToken = (token: string): Promise<Entry> =>
	enter({ token: token.trim() })

/*
 * Sign out: baab deletes the session and clears the cookie. When baab
 * does not answer the cookie stays in place, so the page should not promise
 * more than "signed out here" — it forgets the profile either way.
 */
export async function logout(): Promise<void> {
	if (!BAAB.enabled) return
	try {
		await call('/v1/logout', { method: 'POST' })
	} catch {
		// the page forgets the profile regardless
	}
}

// the nickname, up to 24 characters; false when baab refused or did not answer
export async function saveNickname(nickname: string): Promise<boolean> {
	if (!BAAB.enabled) return false
	try {
		const res = await call('/v1/profile', { method: 'PUT', ...json({ nickname: nickname.trim() }) })
		return res.ok
	} catch {
		return false
	}
}

/*
 * One app's settings, as baab keeps them for the player behind the
 * cookie: `{}` until the app has saved, null when nobody is signed in.
 * Throws when baab does not answer — the caller keeps what it has.
 * Each app reads and replaces only its own object, so two apps saving at
 * the same moment cannot overwrite each other.
 */
export async function fetchAppSettings(app: string): Promise<SavedSettings | null> {
	if (!BAAB.enabled) return null
	const res = await call(`/v1/settings/${encodeURIComponent(app)}`)
	if (res.status === 401) return null
	if (!res.ok) throw new Error(`baab answered ${res.status}`)
	const body = await res.json() as unknown
	return body !== null && typeof body === 'object' && !Array.isArray(body) ? body as SavedSettings : {}
}

/*
 * Replace one app's settings with `settings`, whole. False when baab
 * refused (not signed in, more than 8 KB) or did not answer; the app's own
 * copy in localStorage stands either way, and the next change tries again.
 */
export async function putAppSettings(app: string, settings: SavedSettings): Promise<boolean> {
	if (!BAAB.enabled) return false
	try {
		const res = await call(`/v1/settings/${encodeURIComponent(app)}`, { method: 'PUT', ...json(settings) })
		return res.ok
	} catch {
		return false
	}
}
