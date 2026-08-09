/*
 * Sound playback behind one hook: a single shared audio element (starting a new
 * sound stops the current one), the mute toggle (🔊/🔇), the pending next-prompt
 * timer, and the short feedback sounds. Playback reads from the IndexedDB cache
 * (works in Safari Lockdown Mode) and falls back to the network.
 *
 * A clip can be a bare url, or a url with a `start`/`end` window into it — one
 * recording then serves several renderings (e.g. an anthem's intro is 0 → intro
 * and the anthem proper is intro → end of the same file).
 */
import { useCallback, useRef, useState } from 'react'
import { getAudioBlob } from './audioCache'
import { Score, playScore, Playing, unlockAudio } from './synth'

// a clip is a recording (optionally a `start`/`end` window into it) or a score
// played live by the synthesizer — nothing to download at all
export type Clip = string | { url: string, start?: number, end?: number } | { score: Score }

const isScore = (clip: Clip): clip is { score: Score } =>
	typeof clip !== 'string' && 'score' in clip
const asFile = (clip: Clip) => (typeof clip === 'string' ? { url: clip } : clip as { url: string, start?: number, end?: number })
// the file a clip needs cached, or null for a synthesized score
export const clipUrl = (clip: Clip) => (isScore(clip) ? null : asFile(clip).url)

// short win/lose feedback sounds
// the short feedback sounds: per-guess (correct/wrong/giveup) and per-round
// (complete when everything was played, stopped when the player ended it early)
export type FxName = 'correct' | 'wrong' | 'giveup' | 'complete' | 'stopped'

function playFx(name: FxName) {
	try {
		new Audio(`/sound/fx/${name}.aac`).play().catch(() => {})
	} catch {
		// ignore
	}
}

// A one-sample silent WAV. Played through the shared element inside a user
// gesture, it is what actually lifts Safari's block — the element has to have
// sounded once, and this is the smallest thing that can.
const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='

/*
 * The one element every recording plays through, and whether it has been let off
 * Safari's leash yet.
 *
 * Safari grants playback per element and only from inside a user gesture, so a
 * `new Audio()` built after awaiting the file is born blocked and its `play()`
 * rejects — silently, since the rejection was discarded. One element, unlocked
 * on the first click, means every later `play()` is on an element that already
 * has permission, however long the fetch took.
 *
 * Module scope rather than a ref, like the AudioContext in `synth.ts`: there is
 * one page and one element, and it is not React state — nothing re-renders when
 * it changes, and a ref whose contents get mutated is what `react-hooks` objects
 * to.
 */
let sharedEl: HTMLAudioElement | null = null
let elementUnlocked = false

// onPlayed is called after an icon-tracked sound starts (playing may have added
// the file to the cache, so the caller can refresh its cache count)
export function useAudio(onPlayed?: () => void) {
	// which play the shared element is on, so a late callback from an earlier one
	// can tell that it has been superseded
	const playId = useRef(0)
	// the sound currently playing, so starting a new one can stop it first
	const playingAudio = useRef<HTMLAudioElement | null>(null)
	// object URL of what is playing, so it can be revoked when playback stops
	const playingUrl = useRef<string | null>(null)
	// poller that ends playback at a clip's `end` (a window into a longer file).
	// It watches currentTime rather than counting wall-clock, so start-up decode
	// lag or a stall can't cut the clip short.
	const endTimer = useRef<ReturnType<typeof setInterval> | null>(null)
	// the synthesized score currently sounding, if any
	const playingSynth = useRef<Playing | null>(null)
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

	/*
	 * Take the permission a click carries, before doing anything that awaits.
	 *
	 * Both ways of making sound here need it, and neither can ask later: the
	 * shared element has to have played once, and the synthesizer's context has to
	 * be resumed. Cheap and idempotent, so callers can just call it on every click.
	 */
	const unlock = useCallback(() => {
		unlockAudio()
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
		// retire the current play, so a `loadedmetadata` or `onended` still in
		// flight cannot start or stop anything after this
		playId.current += 1
		if (promptTimer.current) {
			clearTimeout(promptTimer.current)
			promptTimer.current = null
		}
		if (endTimer.current) {
			clearInterval(endTimer.current)
			endTimer.current = null
		}
		if (playingSynth.current) {
			playingSynth.current.stop()
			playingSynth.current = null
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

	// Play a clip, stopping the current one first. With `code` the matching button
	// shows the play icon; game prompts pass none — a ▶ on the target button would
	// reveal the answer. A clip with `start`/`end` plays only that window.
	const play = useCallback(async (clip: Clip, code?: string) => {
		if (mutedRef.current) return
		// harmless when a click already did it; the one case that matters is a
		// direct card press, where this call is still inside the gesture
		unlock()

		// a score is synthesized live: nothing to fetch, nothing to decode
		if (isScore(clip)) {
			stopSound()
			const handle = playScore(clip.score, () => {
				if (playingSynth.current !== handle) return
				playingSynth.current = null
				if (code !== undefined) setPlayingCode(null)
			})
			if (!handle) return
			playingSynth.current = handle
			if (code !== undefined) setPlayingCode(code)
			return
		}

		const { url, start = 0, end } = asFile(clip)
		try {
			const blob = await getAudioBlob(url)
			if (!blob) return
			const objectUrl = URL.createObjectURL(blob)
			// stop and clean up whatever was playing
			if (playingAudio.current) {
				playingAudio.current.onended = null
				playingAudio.current.pause()
			}
			if (endTimer.current) {
				clearInterval(endTimer.current)
				endTimer.current = null
			}
			if (playingUrl.current) URL.revokeObjectURL(playingUrl.current)

			// the shared, already-unlocked element — never a fresh one, which in
			// Safari would have no permission to play by this point
			sharedEl = sharedEl ?? new Audio()
			const audio = sharedEl
			audio.src = objectUrl
			playingAudio.current = audio
			playingUrl.current = objectUrl

			// One element serves every clip now, so "is this still mine?" can no
			// longer be answered by comparing elements — they are always the same
			// one. Each play takes a number instead, and a callback that arrives
			// after the next play has started finds it stale and does nothing.
			playId.current += 1
			const myId = playId.current
			const isCurrent = () => playId.current === myId

			const finish = () => {
				if (!isCurrent()) return
				if (endTimer.current) {
					clearInterval(endTimer.current)
					endTimer.current = null
				}
				audio.onended = null
				audio.pause()
				URL.revokeObjectURL(objectUrl)
				playingAudio.current = null
				playingUrl.current = null
				if (code !== undefined) setPlayingCode(null)
			}
			audio.onended = finish

			const begin = () => {
				if (!isCurrent()) return
				if (start > 0) {
					try {
						audio.currentTime = start
					} catch {
						// seeking unsupported: play from the beginning
					}
				}
				audio.play().catch(e => {
					// Left silent until Safari showed what it was hiding: a refusal here
					// is the browser declining to play at all, which is worth saying.
					console.warn('anthem: playback refused', e?.name ?? e)
				})
				// a windowed clip ends at `end`: poll currentTime so the cut lands on
				// the audio's own clock (±50 ms), not on wall-clock elapsed time
				if (end !== undefined) {
					endTimer.current = setInterval(() => {
						if (audio.currentTime >= end) finish()
					}, 50)
				}
			}
			// seeking needs the duration, so wait for metadata when it isn't there yet
			if (start > 0 && audio.readyState < 1) {
				audio.addEventListener('loadedmetadata', begin, { once: true })
			} else {
				begin()
			}

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
	const schedulePrompt = useCallback((clip: Clip, delayMs: number) => {
		promptTimer.current = setTimeout(() => play(clip), delayMs)
	}, [play])

	// feedback sounds respect the mute toggle
	const fx = useCallback((name: FxName) => {
		if (!mutedRef.current) playFx(name)
	}, [])

	return { playingCode, muted, toggleMute, stopSound, play, schedulePrompt, cancelPrompt, fx, unlock }
}
