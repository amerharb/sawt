/*
 * The game-mode state machine, shared by every app.
 *
 * 🕹️ enters game mode and starts a round: the prompts are pre-loaded, a random
 * target is spoken, and the player taps items on the board. A wrong tap is
 * temporarily disabled with a 👎 marker until the round is won; 🤷‍♂️ gives the
 * target up. The round ends when everything has been played or ✋ is pressed —
 * the clock and stats freeze but game mode stays on — and 🔄 starts a fresh
 * round. Clicking 🕹️ again leaves game mode entirely.
 */
import { useEffect, useRef, useState } from 'react'

import { postRound } from './sada'

const randomOf = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)]

// a round id: the platform UUID where available (everywhere modern), with a
// throwaway fallback so ancient WebViews still get something unique enough
const newRoundId = (): string =>
	typeof crypto !== 'undefined' && 'randomUUID' in crypto
		? crypto.randomUUID()
		: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

/*
 * `P` is whatever the app treats as a prompt. For most apps that is a sound-file
 * url; Anthem passes a richer clip — a url, a start/end window into a longer
 * recording, or a score played live by the synthesizer with no file at all.
 */
type AudioControls<P> = {
	stopSound: () => void,
	play: (prompt: P, code?: string) => void | Promise<void>,
	schedulePrompt: (prompt: P, delayMs: number) => void,
	cancelPrompt: () => void,
	fx: (name: 'correct' | 'wrong' | 'giveup' | 'complete' | 'stopped') => void,
	// Let the audio layer take its one chance to start sound, while the click that
	// began the round is still on the stack. Safari grants playback to the call
	// stack of a user gesture, not to the page, and the first prompt is played
	// after awaiting the preload — too late to ask by then. Optional: an app whose
	// audio needs no such permission can leave it out.
	unlock?: () => void,
}

/*
 * How one target went: what was asked, what got tapped wrongly while it was
 * up (in click order), and whether it ended with 🤷‍♂️ instead of a correct
 * tap. A target's position in the round is its index in RoundResult.targets —
 * targets[9] was the tenth thing asked.
 */
export type TargetResult = {
	// the code that was asked for
	code: string,
	// wrong taps made while this target was up, in the order they happened
	wrong: string[],
	// resolved by giving up rather than finding it
	gaveUp: boolean,
	// how long this target was up, in ms: from being asked (the moment it was
	// set, which is ~650ms before its prompt sounds) to being resolved
	ms: number,
}

/*
 * What one finished round scored. Rounds accumulate in `results` for the whole
 * page visit — entering and leaving game mode does not clear them.
 */
export type RoundResult = {
	// a random UUID minted when the round starts
	id: string,
	// how many items were played — guessed or given up
	solved: number,
	// how many were on the board
	total: number,
	// how long the round took
	elapsedMs: number,
	// wrong taps
	mistakes: number,
	// targets revealed with 🤷‍♂️
	giveUps: number,
	// which flavour of round it was: the selected language, or the anthem type
	mode: string,
	// the board as the round showed it: every item's code, in shown order
	board: string[],
	// every resolved target in order, with its wrong taps — see TargetResult
	targets: TargetResult[],
}
// a round that ran to the end is simply one where solved === total

type UseGameOptions<T, P> = {
	// false keeps 🕹️ disabled (e.g. no language visible)
	canPlay: boolean,
	// the board for a new round, in the order it should be shown
	buildBoard: () => T[],
	// an item's prompt — a sound file for most apps, a clip for Anthem
	promptUrl: (item: T) => P,
	// pre-download the round's prompts so gameplay never waits on the network
	preload: (urls: string[]) => Promise<void>,
	/*
	 * Which files a prompt needs cached. Defaults to the prompt itself when it is
	 * a url. Return several for a prompt spanning more than one file, or none for
	 * one with nothing to download (a synthesized score).
	 */
	urlsOf?: (prompt: P) => string[],
	audio: AudioControls<P>,
	// labels the round in its result — the selected language or anthem type
	mode: string,
	// the app's sada slug ('flag', 'map', …): rounds of apps that pass it are
	// offered to the game-data collector when a build enables it — see sada.ts
	app?: string,
	/*
	 * How many targets one round asks before it ends — the round-length
	 * setting. Absent or 0 plays the whole board. The board itself is the
	 * app's business: Flag deals a hand of this size, Map keeps the world
	 * whole and lets the cap stop the round.
	 */
	roundSize?: number,
	// called when a round starts (e.g. to clear the clicked-name display)
	onRoundStart?: () => void,
}

export function useGame<T extends { code: string }, P = string>(
	{ canPlay, buildBoard, promptUrl, preload, urlsOf, audio, mode, app, roundSize, onRoundStart }: UseGameOptions<T, P>,
) {
	const [gameOn, setGameOn] = useState(false)
	const [board, setBoard] = useState<T[]>([])                // this round's board
	/*
	 * How many targets this round asks: min(roundSize, board length), frozen
	 * when the round starts so a mid-round settings change cannot bend a
	 * running round. While the round is untouched (the ready state — nothing
	 * asked, nothing resolved) the value is derived live instead, so changing
	 * the round length in ⚙️ between rounds shows its 0/N immediately.
	 */
	const [frozenTotal, setTotal] = useState(0)
	const capped = (boardLength: number) =>
		roundSize && roundSize > 0 ? Math.min(roundSize, boardLength) : boardLength
	const [target, setTarget] = useState<string | null>(null)  // code to find
	const [solved, setSolved] = useState<string[]>([])         // played (guessed or given up)
	const [wrongGuesses, setWrongGuesses] = useState<string[]>([]) // wrong for the CURRENT target (temporarily disabled)
	const [mistakes, setMistakes] = useState(0)      // wrong taps this round
	const [giveUps, setGiveUps] = useState(0)        // targets given up this round
	const [gaveUpCodes, setGaveUpCodes] = useState<string[]>([]) // given up on, to mark them 🤷‍♂️
	// every target resolved this round, in order, with its wrong taps
	const [targets, setTargets] = useState<TargetResult[]>([])
	// the running round's random id, minted in startRound
	const roundId = useRef('')
	// when the current target was asked, for TargetResult.ms
	const targetStart = useRef(0)
	// when the round began. State rather than a ref because `elapsedMs` below is
	// computed during render, and refs must not be read there.
	const [roundStart, setRoundStart] = useState(0)
	// when the round ended (all played, or ✋): freezes the clock and stats until
	// 🔄 starts a new round or 🕹️ leaves game mode; null while a round is running
	const [endedAt, setEndedAt] = useState<number | null>(null)
	const [feedback, setFeedback] = useState<{ emoji: string, id: number } | null>(null)
	const feedbackId = useRef(0)
	const [preparing, setPreparing] = useState(false) // downloading prompt sounds before start
	// every round finished so far this game session, newest last
	const [results, setResults] = useState<RoundResult[]>([])

	// record a finished round (played out or stopped early with ⏹️)
	const recordRound = (solvedCount: number, giveUpCount: number, roundTargets: TargetResult[]) => {
		const round: RoundResult = {
			id: roundId.current,
			solved: solvedCount,
			total: frozenTotal,
			elapsedMs: Date.now() - roundStart,
			mistakes,
			giveUps: giveUpCount,
			mode,
			board: board.map(i => i.code),
			targets: roundTargets,
		}
		setResults(r => [...r, round])
		if (app) postRound(app, round)
	}

	// the clock the live ⏱️ time is measured against, refreshed every second while
	// a round runs. Holding the time itself (rather than a dummy tick counter)
	// keeps `elapsedMs` a pure read of state instead of a Date.now() call during
	// render.
	const [now, setNow] = useState(0)
	useEffect(() => {
		if (!gameOn || endedAt !== null) return
		const id = setInterval(() => setNow(Date.now()), 1000)
		return () => clearInterval(id)
	}, [gameOn, endedAt])

	const flashFeedback = (emoji: string) => {
		feedbackId.current += 1
		const id = feedbackId.current
		setFeedback({ emoji, id })
		setTimeout(() => setFeedback(f => (f?.id === id ? null : f)), 700)
	}

	// start a round (also used by 🔄 to restart): preload the prompt sounds,
	// reset the counters, pick the first target and turn game mode on
	const startRound = async () => {
		if (!canPlay || preparing) return
		// first thing, before any await — see `unlock` on AudioControls
		audio.unlock?.()
		audio.stopSound()
		const items = buildBoard()
		setPreparing(true)
		// several prompts can point at the same file, so de-duplicate before
		// fetching; a prompt with no file contributes nothing
		const toUrls = urlsOf ?? ((p: P) => (typeof p === 'string' ? [p] : []))
		// The ⏳ must come down whatever happens here. Preloading is an optimization —
		// a prompt that failed to cache still plays from the network — but when this
		// threw, the flag stayed set and the app sat on ⏳ until a reload, with the
		// game never starting. Safari found that: its IndexedDB can leave a request
		// hanging, and every caller waited on it forever.
		try {
			await preload([...new Set(items.flatMap(i => toUrls(promptUrl(i))))])
		} catch {
			// carry on: the round plays from the network
		} finally {
			setPreparing(false)
		}
		const first = randomOf(items)
		setBoard(items)
		setTotal(capped(items.length))
		setSolved([])
		setWrongGuesses([])
		setMistakes(0)
		setGiveUps(0)
		setGaveUpCodes([])
		setTargets([])
		setEndedAt(null)
		onRoundStart?.()
		// one reading for both, so the clock starts at exactly zero
		const startedAt = Date.now()
		roundId.current = newRoundId()
		targetStart.current = startedAt
		setRoundStart(startedAt)
		setNow(startedAt)
		setTarget(first.code)
		setGameOn(true)
		audio.play(promptUrl(first))
	}

	/*
	 * 🕹️ on: enter game mode ready to play, WITHOUT starting a round. The
	 * board shows, the score reads zero and the clock 0s (endedAt = roundStart
	 * freezes it there), and ▶️ starts the first round — the pause exists so
	 * pre-game options have somewhere to live before anything is committed.
	 */
	const enterGame = () => {
		if (!canPlay) return
		audio.stopSound()
		const t = Date.now()
		setBoard(buildBoard())
		setSolved([])
		setWrongGuesses([])
		setMistakes(0)
		setGiveUps(0)
		setGaveUpCodes([])
		setTargets([])
		setTarget(null)
		setRoundStart(t)
		setNow(t)
		setEndedAt(t)
		setGameOn(true)
	}

	// 🕹️ off: leave game mode entirely (hides the game score and actions).
	// The round results deliberately survive this: they accumulate for the
	// whole page visit so the dev-only ResultsPeek (and one day analytics)
	// can see every round played, not just the current game session's.
	const exitGame = () => {
		audio.stopSound()
		setGameOn(false)
		setTarget(null)
		setWrongGuesses([])
		setFeedback(null)
		setEndedAt(null)
	}

	// ✋: stop the current round early — freeze the clock and stats, stay in game mode
	const stopRound = () => {
		if (target === null) return
		audio.stopSound()
		recordRound(solved.length, giveUps, targets)
		audio.fx('stopped')
		setTarget(null)
		setWrongGuesses([])
		setEndedAt(Date.now())
	}

	// 👂: play the current prompt again
	const replay = () => {
		const item = board.find(i => i.code === target)
		if (item) audio.play(promptUrl(item))
	}

	// mark the target played and move on (or finish the round)
	const advance = (code: string, giveUpCount: number, nextTargets: TargetResult[]) => {
		// cancel any not-yet-fired next-prompt timer (e.g. the player answered
		// the last target before the previous prompt was scheduled to play)
		audio.cancelPrompt()
		// reaching the correct answer re-enables the items marked wrong this round
		setWrongGuesses([])
		const nextSolved = [...solved, code]
		setSolved(nextSolved)
		const remaining = board.filter(i => !nextSolved.includes(i.code))
		if (nextSolved.length >= frozenTotal || remaining.length === 0) {
			// enough played (the round length) or the board ran out — the round
			// is over, but game mode stays on until 🕹️ is clicked again (or ▶️
			// starts a new round)
			audio.stopSound()
			recordRound(nextSolved.length, giveUpCount, nextTargets)
			audio.fx('complete')
			setTarget(null)
			setEndedAt(Date.now())
		} else {
			const next = randomOf(remaining)
			targetStart.current = Date.now()
			setTarget(next.code)
			// let the feedback land before the next prompt
			audio.schedulePrompt(promptUrl(next), 650)
		}
	}

	const guess = (code: string) => {
		if (target === null || solved.includes(code) || wrongGuesses.includes(code)) return
		if (code === target) {
			audio.fx('correct')
			flashFeedback('👍')
			// snapshot how this target went before advance clears wrongGuesses
			const nextTargets = [...targets, { code, wrong: wrongGuesses, gaveUp: false, ms: Date.now() - targetStart.current }]
			setTargets(nextTargets)
			advance(code, giveUps, nextTargets)
		} else {
			// temporarily disable this wrong item (with a 👎 marker) until the round is won
			setWrongGuesses(w => (w.includes(code) ? w : [...w, code]))
			setMistakes(m => m + 1)
			audio.fx('wrong')
			flashFeedback('👎')
		}
	}

	// 🧹: resort the board so everything already played (guessed or given up)
	// sits at the end — late in a long round the remaining targets stop hiding
	// between the solved cards. A stable partition: both halves keep their
	// current relative order. One-shot: newly solved cards stay where they are
	// until the next sweep.
	const sweepSolved = () => {
		setBoard(b => [
			...b.filter(i => !solved.includes(i.code)),
			...b.filter(i => solved.includes(i.code)),
		])
	}

	// give up on the current target: counts as played and as a give-up (not a mistake)
	const giveUp = () => {
		if (target === null) return
		const nextGiveUps = giveUps + 1
		setGiveUps(nextGiveUps)
		setGaveUpCodes(g => (g.includes(target) ? g : [...g, target]))
		audio.fx('giveup')
		flashFeedback('🤷‍♂️')
		const nextTargets = [...targets, { code: target, wrong: wrongGuesses, gaveUp: true, ms: Date.now() - targetStart.current }]
		setTargets(nextTargets)
		advance(target, nextGiveUps, nextTargets)
	}

	return {
		canPlay,
		gameOn, board, target, solved, wrongGuesses, mistakes, giveUps, gaveUpCodes,
		// how many targets this round asks — the score's denominator
		total: target === null && solved.length === 0 && targets.length === 0
			? capped(board.length)
			: frozenTotal,
		endedAt, preparing, feedback, results,
		// how long the round has been running (frozen once it ends)
		elapsedMs: (endedAt ?? now) - roundStart,
		enterGame, startRound, exitGame, stopRound, replay, guess, giveUp, sweepSolved,
		// one control for ⏹️/▶️: stop the running round, or start a fresh one
		toggleRound: () => (target !== null ? stopRound() : startRound()),
	}
}
