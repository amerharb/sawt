import type { ReactNode } from 'react'

/*
 * The two game-only app-bar segments: the live score (frozen when the round
 * ends) and the round actions (👂 replay, 🤷‍♂️ give up, ▶️ start and ⏹️ stop).
 *
 * UI strings come from a translate function `t` passed by the app, so these
 * segments stay presentational and localization lives in one place.
 */

// structural type so this stays app-agnostic (no import from i18n)
type Translate = (key: string) => string

/*
 * The ⏱️ readout grows with the round: seconds alone under a minute, then
 * m:ss, then h:mm:ss, and past midnight whole days spelled out — localized
 * via `time.day`/`time.days`:
 *   4 s · 1:01 · 59:34 · 1:09:03 · 3 days 09:20:03 · 1000 days 03:30:34
 */
const formatDuration = (ms: number, t: Translate) => {
	const total = Math.round(ms / 1000)
	const pad = (n: number) => String(n).padStart(2, '0')
	const s = total % 60
	const m = Math.floor(total / 60) % 60
	const h = Math.floor(total / 3600) % 24
	const d = Math.floor(total / 86400)
	if (d > 0) return `${d} ${t(d === 1 ? 'time.day' : 'time.days')} ${pad(h)}:${pad(m)}:${pad(s)}`
	if (h > 0) return `${h}:${pad(m)}:${pad(s)}`
	if (m > 0) return `${m}:${pad(s)}`
	return `${s} s`
}

type ScoreProps = {
	t: Translate,
	played: number,
	total: number,
	mistakes: number,
	giveUps: number,
	ms: number,
}

export function GameScore({ t, played, total, mistakes, giveUps, ms }: Readonly<ScoreProps>) {
	return (
		<div className="game-score">
			<span title={t('score.played')}>🏁 {played} / {total}</span>
			<span title={t('score.mistakes')}>👎 {mistakes}</span>
			<span title={t('score.giveUps')}>🤷‍♂️ {giveUps}</span>
			<span title={t('score.time')}>⏱️ {formatDuration(ms, t)}</span>
		</div>
	)
}

type ActionsProps = {
	t: Translate,
	/*
	 * Something to put at the head of the cluster — 🏟️, where an app offers
	 * multiplayer. It lives here rather than in the toolbar because a
	 * courtyard is a way of playing, so a child reaches it the same way they
	 * reach a round: 🕹️ first, then choose.
	 */
	lead?: ReactNode,
	// a round is running: 👂, 🤷‍♂️ and ⏹️ work, and ▶️ does not
	roundActive: boolean,
	// 👂 is also pointless while muted
	muted: boolean,
	// the toggle is disabled while the next round's sounds are still downloading
	preparing: boolean,
	onReplay: () => void,
	onGiveUp: () => void,
	/*
	 * 🧹 sweep the settled cards to the end — omitted by apps where the board
	 * order is the content (week) or the board is no grid at all (map), which
	 * is the one kind of absence left here: those two never draw it in any
	 * state. Everywhere else it stays on screen in a room as well, sweeping
	 * that child's view of the shared board.
	 */
	onSweep?: () => void,
	// something is solved, so a sweep would actually move cards
	sweepReady?: boolean,
	/*
	 * Two buttons, not one that changes its face. ▶️ starts a round and ⏹️
	 * stops the running one, and both are always on screen: a handler left
	 * undefined means "not this child's to do right now" and draws the button
	 * disabled rather than removing it. In a room that is how it reads — ▶️
	 * belongs to the host, and ⏹️ to nobody, since stopping would stop
	 * everyone's game.
	 *
	 * One control that swapped its emoji made the state machine harder to
	 * write than it needed to be: *ready* and *round* differed by what a
	 * single button meant. Now each state simply lists which buttons are live.
	 */
	onStart?: () => void,
	onStop?: () => void,
}

export function GameActions({ t, lead, roundActive, muted, preparing, onReplay, onGiveUp, onSweep, sweepReady, onStart, onStop }: Readonly<ActionsProps>) {
	return (
		<div className="game-actions">
			{lead}
			<button
				aria-label={t('action.replay')}
				title={t('action.replayTitle')}
				disabled={muted || !roundActive}
				onClick={onReplay}
			>
				👂
			</button>
			<button
				aria-label={t('action.giveUp')}
				title={t('action.giveUpTitle')}
				disabled={!roundActive}
				onClick={onGiveUp}
			>
				🤷‍♂️
			</button>
			{onSweep && (
				<button
					aria-label={t('action.sweep')}
					title={t('action.sweepTitle')}
					disabled={!roundActive || !sweepReady}
					onClick={onSweep}
				>
					🧹
				</button>
			)}
			<button
				aria-label={t('action.restart')}
				title={t('action.restartTitle')}
				disabled={preparing || roundActive || !onStart}
				onClick={onStart}
			>
				▶️
			</button>
			<button
				aria-label={t('action.stop')}
				title={t('action.stopTitle')}
				disabled={preparing || !roundActive || !onStop}
				onClick={onStop}
			>
				⏹️
			</button>
		</div>
	)
}
