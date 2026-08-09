/*
 * Live melody playback: an anthem stored as notes is synthesized in the browser
 * instead of streaming a recording — a few hundred bytes of text instead of a
 * megabyte of audio, and the tempo or timbre can change on the fly.
 *
 * Score format (a compact, monophonic subset of what ABC notation expresses):
 * space-separated `<note><octave>/<beats>` tokens, where a beat is a quarter
 * note and `r` is a rest, e.g.
 *
 *   F4/0.5 D4/0.5 Bb3/1 D4/1 F4/1 Bb4/2 r/0.5
 *
 * Note names are C D E F G A B with an optional `#`/`b`, and the octave is in
 * scientific pitch notation (middle C is C4).
 */

export type Score = {
	// quarter notes per minute
	tempo: number,
	melody: string,
}

export type Note = {
	// MIDI note number, or null for a rest
	midi: number | null,
	// length in quarter notes
	beats: number,
}

const STEPS: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

// "Bb3" -> 58, "F4" -> 65, "r" -> null
function midiOf(pitch: string): number | null {
	if (pitch === 'r' || pitch === 'R') return null
	const m = /^([A-Ga-g])([#b]?)(-?\d+)$/.exec(pitch)
	if (!m) return null
	const step = STEPS[m[1].toUpperCase()]
	const accidental = m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0
	const octave = parseInt(m[3], 10)
	return (octave + 1) * 12 + step + accidental
}

export function parseScore(melody: string): Note[] {
	const notes: Note[] = []
	for (const token of melody.trim().split(/\s+/)) {
		if (!token) continue
		const [pitch, len] = token.split('/')
		const beats = len === undefined ? 1 : parseFloat(len)
		if (!Number.isFinite(beats) || beats <= 0) continue
		notes.push({ midi: midiOf(pitch), beats })
	}
	return notes
}

export const freqOf = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

// how long the whole score lasts, in seconds
export function scoreDuration(score: Score): number {
	const beats = parseScore(score.melody).reduce((sum, n) => sum + n.beats, 0)
	return (beats * 60) / score.tempo
}

// one AudioContext for the page, created on first use (a user gesture by then)
let ctx: AudioContext | null = null
function audioContext(): AudioContext | null {
	try {
		const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
		if (!Ctor) return null
		ctx = ctx ?? new Ctor()
		if (ctx.state === 'suspended') void ctx.resume()
		return ctx
	} catch {
		return null
	}
}

/*
 * Build and resume the AudioContext now, while a user gesture is on the stack.
 *
 * Safari starts every context suspended and only honours `resume()` from inside
 * a gesture; elsewhere the promise settles but the context stays suspended, and
 * a suspended context's clock does not advance — so a melody scheduled against
 * `currentTime` is written into a timeline that never arrives, and nothing is
 * heard. Chrome is content with any earlier interaction on the page, which is
 * why this only ever showed up in Safari.
 *
 * Call it from the click itself, not from the playback that the click leads to:
 * a game round reaches the synthesizer only after awaiting the preload, and by
 * then the gesture is spent.
 */
export function unlockAudio(): void {
	audioContext()
}

export type Playing = { stop: () => void }

// Schedule the whole melody up front — the browser's audio clock keeps it in
// time even when the main thread is busy. Returns a handle that stops it.
export function playScore(score: Score, onEnd?: () => void): Playing | null {
	const audio = audioContext()
	if (!audio) return null

	const master = audio.createGain()
	master.gain.value = 0.22
	master.connect(audio.destination)

	const secondsPerBeat = 60 / score.tempo
	const oscillators: OscillatorNode[] = []
	let at = audio.currentTime + 0.06

	for (const note of parseScore(score.melody)) {
		const seconds = note.beats * secondsPerBeat
		if (note.midi !== null) {
			const osc = audio.createOscillator()
			const gain = audio.createGain()
			// a triangle sounds closer to a flute/whistle than a bare sine, and its
			// softer harmonics make the melody easier to follow
			osc.type = 'triangle'
			osc.frequency.value = freqOf(note.midi)
			// short attack and release so repeated notes stay separate and no clicks
			const hold = Math.max(0.04, seconds * 0.82)
			gain.gain.setValueAtTime(0, at)
			gain.gain.linearRampToValueAtTime(1, at + 0.012)
			gain.gain.setValueAtTime(1, at + hold)
			gain.gain.linearRampToValueAtTime(0, at + Math.max(hold + 0.02, seconds * 0.97))
			osc.connect(gain)
			gain.connect(master)
			osc.start(at)
			osc.stop(at + seconds + 0.02)
			oscillators.push(osc)
		}
		at += seconds
	}

	let endTimer: ReturnType<typeof setTimeout> | null = setTimeout(
		() => {
			endTimer = null
			onEnd?.()
		},
		Math.max(0, (at - audio.currentTime) * 1000),
	)

	return {
		stop() {
			if (endTimer) {
				clearTimeout(endTimer)
				endTimer = null
			}
			for (const osc of oscillators) {
				try {
					osc.stop()
				} catch {
					// already stopped
				}
			}
			master.disconnect()
		},
	}
}
