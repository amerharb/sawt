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
import { Score, playScore, Playing } from './synth'

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

// onPlayed is called after an icon-tracked sound starts (playing may have added
// the file to the cache, so the caller can refresh its cache count)
export function useAudio(onPlayed?: () => void) {
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

	const stopSound = useCallback(() => {
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

			const audio = new Audio(objectUrl)
			playingAudio.current = audio
			playingUrl.current = objectUrl

			const finish = () => {
				if (playingAudio.current !== audio) return
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
				if (start > 0) {
					try {
						audio.currentTime = start
					} catch {
						// seeking unsupported: play from the beginning
					}
				}
				audio.play().catch(() => {})
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
	}, [onPlayed])

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

	return { playingCode, muted, toggleMute, stopSound, play, schedulePrompt, cancelPrompt, fx }
}
