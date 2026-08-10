/*
 * Sound playback behind one hook: a single shared audio element (starting a new
 * sound stops the current one), the mute toggle (🔊/🔇), the pending next-prompt
 * timer, and the short feedback sounds. Playback reads from the IndexedDB cache
 * (works in Safari Lockdown Mode) and falls back to the network.
 *
 * Born with the Safari lessons the older apps learned in 0.21.1: one element,
 * unlocked inside the first click, and never a fresh `new Audio()` after an
 * await — Safari grants playback per element and only to the call stack of a
 * user gesture, so an element built after fetching the file has no permission
 * and refuses in silence.
 */
import { useCallback, useRef, useState } from 'react'
import { getAudioBlob } from './audioCache'

// short win/lose feedback sounds
// the short feedback sounds: per-guess (correct/wrong/giveup) and per-round
// (complete when everything was played, stopped when the player ended it early)
export type FxName = 'correct' | 'wrong' | 'giveup' | 'complete' | 'stopped'

function playFx(name: FxName) {
	try {
		// fx fire synchronously inside the click that caused them, which is why a
		// fresh element is fine here where it is not for the fetched prompts
		new Audio(`/sound/fx/${name}.aac`).play().catch(() => {})
	} catch {
		// ignore
	}
}

// A one-sample silent WAV. Played through the shared element inside a user
// gesture, it is what actually lifts Safari's block — the element has to have
// sounded once, and this is the smallest thing that can.
const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='

// The one element every recording plays through, and whether it has been let
// off Safari's leash yet. Module scope rather than a ref: there is one page and
// one element, and nothing re-renders when it changes.
let sharedEl: HTMLAudioElement | null = null
let elementUnlocked = false

// onPlayed is called after an icon-tracked sound starts (playing may have added
// the file to the cache, so the caller can refresh its cache count)
export function useAudio(onPlayed?: () => void) {
	// which play the shared element is on, so a late callback from an earlier one
	// can tell that it has been superseded (the element itself is always the same)
	const playId = useRef(0)
	// the sound currently playing, so starting a new one can stop it first
	const playingAudio = useRef<HTMLAudioElement | null>(null)
	// object URL of what is playing, so it can be revoked when playback stops
	const playingUrl = useRef<string | null>(null)
	// code of the item whose sound is playing, to show the play icon on its button
	const [playingCode, setPlayingCode] = useState<string | null>(null)

	// 🔇: when muted, nothing plays (prompts, names, or feedback sounds).
	// A ref mirrors the state so the audio helpers and pending prompt timers
	// always see the current value.
	const [muted, setMuted] = useState(false)
	const mutedRef = useRef(false)

	// pending "play the next prompt" timer during the game, so it can be cancelled
	// if the game ends (or is stopped) before it fires — otherwise a late timer
	// would start a sound after the game is already over
	const promptTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

	// Take the permission a click carries, before doing anything that awaits.
	// Cheap and idempotent, so callers can just call it on every click; the game
	// calls it through `audio.unlock` before awaiting its preload.
	const unlock = useCallback(() => {
		if (elementUnlocked) return
		try {
			sharedEl = sharedEl ?? new Audio()
			sharedEl.src = SILENCE
			const p = sharedEl.play()
			if (p?.catch) p.catch(() => { /* blocked anyway; playback will report it */ })
			elementUnlocked = true
		} catch {
			// no Audio available at all — nothing further to try
		}
	}, [])

	const stopSound = useCallback(() => {
		// retire the current play, so an `onended` still in flight cannot stop
		// anything after this
		playId.current += 1
		if (promptTimer.current) {
			clearTimeout(promptTimer.current)
			promptTimer.current = null
		}
		if (playingAudio.current) {
			playingAudio.current.onended = null
			playingAudio.current.pause()
			playingAudio.current = null
		}
		if (playingUrl.current) {
			URL.revokeObjectURL(playingUrl.current)
			playingUrl.current = null
		}
		setPlayingCode(null)
	}, [])

	// mute toggle (🔊/🔇): muting also silences whatever is playing right now
	const toggleMute = () => {
		const next = !muted
		mutedRef.current = next
		if (next) stopSound()
		setMuted(next)
	}

	// Play a sound, stopping the current one first. With `code` the matching
	// button shows the play icon; game prompts pass none — a ▶ on the target
	// button would reveal the answer.
	const play = useCallback(async (url: string, code?: string) => {
		if (mutedRef.current) return
		// harmless when a click already did it; the one case that matters is a
		// direct card press, where this call is still inside the gesture
		unlock()
		try {
			const blob = await getAudioBlob(url)
			if (!blob) return
			const objectUrl = URL.createObjectURL(blob)
			// stop and clean up whatever was playing
			if (playingAudio.current) {
				playingAudio.current.onended = null
				playingAudio.current.pause()
			}
			if (playingUrl.current) URL.revokeObjectURL(playingUrl.current)

			// the shared, already-unlocked element — never a fresh one, which in
			// Safari would have no permission to play by this point
			sharedEl = sharedEl ?? new Audio()
			const audio = sharedEl
			audio.src = objectUrl
			playingAudio.current = audio
			playingUrl.current = objectUrl

			playId.current += 1
			const myId = playId.current

			audio.onended = () => {
				if (playId.current !== myId) return
				audio.onended = null
				URL.revokeObjectURL(objectUrl)
				playingAudio.current = null
				playingUrl.current = null
				if (code !== undefined) setPlayingCode(null)
			}
			audio.play().catch(e => {
				// a refusal here is the browser declining to play at all — say so
				console.warn('face: playback refused', e?.name ?? e)
			})
			if (code !== undefined) {
				setPlayingCode(code)
				onPlayed?.()
			}
		} catch (e) {
			console.error(e)
		}
	}, [onPlayed, unlock])

	// cancel a not-yet-fired next prompt without stopping the playing sound
	const cancelPrompt = useCallback(() => {
		if (promptTimer.current) {
			clearTimeout(promptTimer.current)
			promptTimer.current = null
		}
	}, [])

	// play a prompt after a delay (lets the game feedback land first);
	// cancelled by stopSound or cancelPrompt
	const schedulePrompt = useCallback((url: string, delayMs: number) => {
		promptTimer.current = setTimeout(() => play(url), delayMs)
	}, [play])

	// feedback sounds respect the mute toggle
	const fx = useCallback((name: FxName) => {
		if (!mutedRef.current) playFx(name)
	}, [])

	return { playingCode, muted, toggleMute, stopSound, play, schedulePrompt, cancelPrompt, fx, unlock }
}
