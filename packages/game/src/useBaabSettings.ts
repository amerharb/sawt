import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { fetchAppSettings, putAppSettings } from './baab'
import type { SavedSettings } from './baab'
import type { Session } from './useBaab'

// a change waits this long before it goes to baab, so a run of taps —
// five colours hidden one after another — is one save, not five
export const SAVE_AFTER_MS = 600

export type BaabSettings = {
	// the player changed something: keep it at baab too, a moment later
	save: (settings: SavedSettings) => void,
}

type Options = {
	// this page's settings, as they would be saved
	read: () => SavedSettings,
	// baab holds settings this page does not have: take them
	apply: (saved: SavedSettings) => void,
}

/*
 * An app's settings, kept by baab for whoever is signed in, so a child's
 * choices follow them from the tablet to the laptop. localStorage stays the
 * app's own copy — what it loads from, what it falls back on — and baab
 * is a second one that travels.
 *
 * Which copy wins:
 *   - at sign-in, the account's. A device that signs in takes the settings
 *     the player made elsewhere; only an account that has never saved here
 *     takes this device's, which then seed it.
 *   - after that, the player's own changes, saved a moment after they make
 *     them. Only changes the player makes are sent: settings taken from
 *     baab are not sent back.
 *   - when the tab is looked at again, the account's, if another device
 *     changed them meanwhile — unless a change of this page's is still on
 *     its way, which then wins.
 *
 * Baab not answering changes nothing: the page goes on with its own
 * copy, and the next change tries again. Signed out, the hook does nothing.
 */
export function useBaabSettings(app: string, session: Session, { read, apply }: Options): BaabSettings {
	const handle = session.state === 'in' ? session.profile.handle : null
	// the latest callbacks, so baab's answer meets this render's settings
	const readRef = useRef(read)
	const applyRef = useRef(apply)
	useLayoutEffect(() => {
		readRef.current = read
		applyRef.current = apply
	})
	const handleRef = useRef(handle)
	// what baab holds, as far as this page knows, as JSON
	const known = useRef<string | null>(null)
	// a change of the player's, waiting to be sent
	const waiting = useRef<{ timer: ReturnType<typeof setTimeout>, settings: SavedSettings } | null>(null)
	// bumped by every change, so an answer that left before one is not applied over it
	const changes = useRef(0)

	const send = useCallback(async (settings: SavedSettings) => {
		const text = JSON.stringify(settings)
		if (text === known.current) return
		if (await putAppSettings(app, settings)) known.current = text
	}, [app])

	const pull = useCallback(async (seed: boolean) => {
		const before = changes.current
		let saved: SavedSettings | null
		try {
			saved = await fetchAppSettings(app)
		} catch {
			return
		}
		// signed out meanwhile, or the player changed something while we asked
		if (saved === null || handleRef.current === null) return
		if (waiting.current !== null || changes.current !== before) return
		if (Object.keys(saved).length === 0) {
			// an account that never saved here takes this device's settings
			if (seed) await send(readRef.current())
			return
		}
		const text = JSON.stringify(saved)
		if (text === known.current) return
		known.current = text
		applyRef.current(saved)
	}, [app, send])

	useEffect(() => {
		handleRef.current = handle
		known.current = null
		if (handle === null) return
		void pull(true)
		const onVisibility = () => {
			if (document.visibilityState === 'visible') {
				void pull(false)
			} else if (waiting.current !== null) {
				// the tab is going away: send what is waiting now, not in a moment
				clearTimeout(waiting.current.timer)
				const { settings } = waiting.current
				waiting.current = null
				void send(settings)
			}
		}
		document.addEventListener('visibilitychange', onVisibility)
		return () => document.removeEventListener('visibilitychange', onVisibility)
	}, [handle, pull, send])

	// a change still waiting when the page goes is dropped with it
	useEffect(() => () => {
		if (waiting.current !== null) clearTimeout(waiting.current.timer)
	}, [])

	const save = useCallback((settings: SavedSettings) => {
		if (handleRef.current === null) return
		changes.current += 1
		if (waiting.current !== null) clearTimeout(waiting.current.timer)
		const timer = setTimeout(() => {
			waiting.current = null
			void send(settings)
		}, SAVE_AFTER_MS)
		waiting.current = { timer, settings }
	}, [send])

	return { save }
}
