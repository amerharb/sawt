import { useCallback, useEffect, useRef, useState } from 'react'
import { BAAB, fetchProfile, requestCode, verifyCode, verifyToken, logout, saveNickname } from './baab'
import type { Entry, Knock, Profile } from './baab'

/*
 * The session, as this page knows it. `unknown` lasts from the first render
 * until the door has answered once; a page draws nothing about sign-in in
 * that moment rather than a "Sign in" that turns into a name a beat later.
 */
export type Session =
	| { state: 'unknown' }
	| { state: 'out' }
	| { state: 'in', profile: Profile }

export type Baab = {
	session: Session,
	// the email a code went out to, while one is outstanding — the sheet
	// resumes at the code step, even closed and opened again
	pending: string | null,
	// how arriving by magic link went, until the page has shown it
	arrival: Entry | null,
	// step one: ask for a code
	knock: (email: string) => Promise<Knock>,
	// step two: spend it
	enter: (code: string) => Promise<Entry>,
	leave: () => Promise<void>,
	rename: (nickname: string) => Promise<boolean>,
	// back to the email step
	forget: () => void,
	// the arrival has been shown
	settle: () => void,
}

const LOGIN_PARAM = 'login'

/*
 * The token a magic link carried, taken out of the address bar before it is
 * spent — so a reload, a bookmark or a shared link never replays it, and so
 * the second run of the mount effect under StrictMode finds nothing.
 */
export function takeLoginToken(): string | null {
	const url = new URL(window.location.href)
	const token = url.searchParams.get(LOGIN_PARAM)
	if (token === null) return null
	url.searchParams.delete(LOGIN_PARAM)
	window.history.replaceState(window.history.state, '', url)
	return token.trim() === '' ? null : token.trim()
}

/*
 * Who is signed in, and the four things a page can do about it. One of these
 * per page; `app` is the page's slug, which is where the magic link lands.
 *
 * The verdict is this page load's alone. Nothing about the session is kept
 * in localStorage — not "in", not "out" — because the cookie is shared by
 * the whole family and any app may change it: sign in on the landing page,
 * open Flag, and Flag has to ask, not remember. A door that does not answer
 * reads as "signed out, for now", and a tab looked at again after a while
 * asks again, so a sign-out elsewhere shows on the next glance.
 *
 * `wanted` is the page's own gate on top of the env switch — a beta flag,
 * say. Off, the hook asks nothing and reports signed out.
 */
export function useBaab(app: string, wanted = true): Baab {
	const on = wanted && BAAB.enabled
	const [session, setSession] = useState<Session>(() => (on ? { state: 'unknown' } : { state: 'out' }))
	const [pending, setPending] = useState<string | null>(null)
	const [arrival, setArrival] = useState<Entry | null>(null)
	// the magic link's verify, shared by StrictMode's two runs of the mount effect
	const arriving = useRef<Promise<Entry> | null>(null)

	const refresh = useCallback(async () => {
		try {
			const profile = await fetchProfile()
			setSession(profile ? { state: 'in', profile } : { state: 'out' })
		} catch {
			// a silent door settles the first question as "out", and changes
			// nothing about a session already known — the cookie is still there
			setSession(prev => (prev.state === 'unknown' ? { state: 'out' } : prev))
		}
	}, [])

	useEffect(() => {
		if (!on) return
		let cancelled = false
		const token = takeLoginToken()
		if (token) arriving.current = verifyToken(token)
		void (async () => {
			if (arriving.current) {
				const entry = await arriving.current
				if (!cancelled) setArrival(entry)
			}
			if (!cancelled) await refresh()
		})()
		const onVisible = () => {
			if (document.visibilityState === 'visible') void refresh()
		}
		document.addEventListener('visibilitychange', onVisible)
		return () => {
			cancelled = true
			document.removeEventListener('visibilitychange', onVisible)
		}
	}, [on, refresh])

	const knock = useCallback(async (email: string): Promise<Knock> => {
		const outcome = await requestCode(email, app)
		// a code that went out — now, or within the last minute — is one to type
		if (outcome === 'sent' || outcome === 'wait') setPending(email.trim())
		return outcome
	}, [app])

	const enter = useCallback(async (code: string): Promise<Entry> => {
		if (pending === null) return 'wrong'
		const outcome = await verifyCode(pending, code)
		if (outcome === 'in') {
			setPending(null)
			await refresh()
		}
		return outcome
	}, [pending, refresh])

	const leave = useCallback(async () => {
		await logout()
		setSession({ state: 'out' })
	}, [])

	const rename = useCallback(async (nickname: string) => {
		const ok = await saveNickname(nickname)
		if (ok) {
			setSession(prev => (prev.state === 'in'
				? { state: 'in', profile: { ...prev.profile, nickname: nickname.trim() } }
				: prev))
		}
		return ok
	}, [])

	const forget = useCallback(() => setPending(null), [])
	const settle = useCallback(() => setArrival(null), [])

	return { session, pending, arrival, knock, enter, leave, rename, forget, settle }
}
