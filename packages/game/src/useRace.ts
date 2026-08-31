/*
 * The room, as this browser sees it.
 *
 * useGame is a state machine: it picks the targets and decides who is right.
 * useRace is the opposite — it *receives* a state machine. The server owns the
 * board, the order, and every verdict; this hook holds a socket, keeps the
 * pieces the screen needs, and speaks each target aloud in whatever language
 * this child chose. That asymmetry is deliberate: it is the only way two
 * children hearing different languages can play the very same round.
 *
 * What stays local, because a round-trip would ruin it: the 👎 on a wrong tap
 * and the card it greys out. The client knows the target, so it can be honest
 * about a miss instantly; the server hears about it and tells the room, but
 * nobody waits for that.
 *
 * Single-player is untouched. An app that never calls this hook, or a build
 * with no VITE_SAHA_URL, is exactly the app it was before.
 */
import { useCallback, useEffect, useRef, useState } from 'react'

import { postRound } from './sada'
import { RoundResult, TargetResult } from './useGame'
import {
	ClientMsg,
	Palettes,
	RacePlayer,
	RaceSnapshot,
	SAHA,
	Seat,
	ServerMsg,
	forgetSeat,
	recallSeat,
	rememberSeat,
	sahaHealthy,
	sahaPalettes,
	socketUrl,
} from './saha'

/*
 * `off` is not in a room at all. `lost` is the unhappy end: the socket went
 * and did not come back, or the server closed the courtyard — the app falls
 * back to single-player and says so, rather than hanging on a dead board.
 */
export type RacePhase = 'off' | 'connecting' | 'lobby' | 'dealing' | 'playing' | 'finished' | 'lost'

type AudioControls = {
	stopSound: () => void,
	play: (url: string, code?: string) => void | Promise<void>,
	fx: (name: 'correct' | 'wrong' | 'giveup' | 'complete' | 'stopped') => void,
	unlock?: () => void,
}

export type UseRaceOptions = {
	// the app's saha slug — the same one sada knows it by
	app: string,
	/*
	 * Every code this client could actually play right now: the items that are
	 * visible AND have a recording in the selected language. The server deals
	 * the board from the intersection of everyone's, so a child is never asked
	 * for a sound they do not have.
	 */
	playable: () => string[],
	promptUrl: (code: string) => string,
	preload: (urls: string[]) => Promise<void>,
	audio: AudioControls,
	/*
	 * What to label a finished round in the collector — the selected language,
	 * exactly as the solo game's `mode` is. It is posted as `race:<mode>`, so a
	 * courtyard round is never mistaken for a child playing alone.
	 */
	mode: string,
	// called when a fresh round is dealt (e.g. to clear the display)
	onRoundStart?: () => void,
}

const MAX_RESUME_TRIES = 3

/** The same id the solo game gives a round — a UUID where one is available. */
const newRoundId = (): string =>
	typeof crypto !== 'undefined' && 'randomUUID' in crypto
		? crypto.randomUUID()
		: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

export function useRace({ app, playable, promptUrl, preload, audio, mode, onRoundStart }: UseRaceOptions) {
	// is multiplayer configured and answering? Nothing shows until it is
	const [available, setAvailable] = useState(false)
	const [palettes, setPalettes] = useState<Palettes | null>(null)
	const [phase, setPhase] = useState<RacePhase>('off')
	const [room, setRoom] = useState('')
	const [roomEmoji, setRoomEmoji] = useState('')
	const [me, setMe] = useState('')
	const [hostId, setHostId] = useState('')
	const [players, setPlayers] = useState<RacePlayer[]>([])
	const [board, setBoard] = useState<string[]>([])
	const [target, setTarget] = useState<string | null>(null)
	const [done, setDone] = useState<string[]>([])
	const [wrong, setWrong] = useState<string[]>([])
	const [winners, setWinners] = useState<string[] | null>(null)
	const [votes, setVotes] = useState({ votes: 0, needed: 0 })
	const [error, setError] = useState<string | null>(null)
	const [feedback, setFeedback] = useState<{ emoji: string, id: number } | null>(null)
	// the round clock: a local stopwatch that adopts the server's figure when
	// the round freezes, because tablets disagree about what time it is
	const [startedAt, setStartedAt] = useState(0)
	const [frozenMs, setFrozenMs] = useState<number | null>(null)
	const [tick, setTick] = useState(0)

	const ws = useRef<WebSocket | null>(null)
	const seat = useRef<Seat | null>(null)
	const tries = useRef(0)
	const feedbackId = useRef(0)
	/*
	 * A socket callback outlives the render that made it, so everything it
	 * reads lives in a ref — the app's current language, who this child is,
	 * and which target is up. They are refreshed after each render rather
	 * than during it, because a render must not touch a ref.
	 */
	const opts = useRef({ app, playable, promptUrl, preload, audio, mode, onRoundStart })
	const meRef = useRef('')
	const targetRef = useRef<string | null>(null)
	const reconnect = useRef<((msg: ClientMsg) => void) | null>(null)
	/*
	 * This child's own account of the round, for the collector. Only what this
	 * browser actually witnessed: the codes as they were asked, how long each
	 * was up, which ones *this* child tapped wrongly, and which the room gave
	 * up on. Somebody else's misses are their own business.
	 */
	const roundId = useRef('')
	const roundLog = useRef<TargetResult[]>([])
	const targetAt = useRef(0)
	const missed = useRef<string[]>([])

	useEffect(() => {
		let alive = true
		void (async () => {
			const ok = await sahaHealthy()
			if (!alive) return
			setAvailable(ok)
			if (ok) setPalettes(await sahaPalettes())
		})()
		return () => {
			alive = false
		}
	}, [])

	// the live clock, while a round runs
	useEffect(() => {
		if (phase !== 'playing') return
		const id = setInterval(() => setTick(Date.now()), 1000)
		return () => clearInterval(id)
	}, [phase])

	/*
	 * The board as the round was dealt it, for the record posted at the end.
	 * `board` state is what the screen draws; this is what it was, read from a
	 * socket callback where state would be a render behind.
	 */
	const boardRef = useRef<string[]>([])

	/** One target, closed: what it was, how long, and how this child did. */
	const noteTarget = useCallback((code: string, gaveUp: boolean) => {
		roundLog.current = [...roundLog.current, {
			code,
			wrong: missed.current,
			gaveUp,
			ms: targetAt.current > 0 ? Date.now() - targetAt.current : 0,
		}]
		missed.current = []
	}, [])

	const flash = useCallback((emoji: string) => {
		feedbackId.current += 1
		const id = feedbackId.current
		setFeedback({ emoji, id })
		setTimeout(() => setFeedback(f => (f?.id === id ? null : f)), 700)
	}, [])

	const say = useCallback((msg: ClientMsg) => {
		if (ws.current?.readyState === WebSocket.OPEN) {
			ws.current.send(JSON.stringify(msg))
		}
	}, [])

	const absorb = useCallback((snap: RaceSnapshot) => {
		setRoom(snap.room)
		setRoomEmoji(snap.roomEmoji)
		setHostId(snap.hostId)
		setPlayers(snap.players)
		setBoard(snap.board)
		setDone(snap.done)
		setWrong(snap.wrong)
		setVotes({ votes: snap.skipVotes, needed: snap.skipNeeded })
		setWinners(snap.winners.length > 0 ? snap.winners : null)
		setTarget(snap.current?.code ?? null)
		setPhase(snap.phase)
		if (snap.phase === 'playing') {
			// a snapshot is the only clock a resuming client has
			const at = Date.now()
			setStartedAt(at - snap.elapsedMs)
			setTick(at)
			setFrozenMs(null)
		} else if (snap.phase === 'finished') {
			setFrozenMs(snap.elapsedMs)
		}
	}, [])

	const handle = useCallback((msg: ServerMsg) => {
		const { promptUrl, preload, audio, onRoundStart } = opts.current
		switch (msg.type) {
			case 'welcome': {
				tries.current = 0
				setError(null)
				setMe(msg.playerId)
				seat.current = { room: msg.snapshot.room, playerId: msg.playerId, token: msg.token }
				rememberSeat(seat.current)
				absorb(msg.snapshot)
				// the invite link has been spent; leave the address bar clean so a
				// reload or a re-share cannot point at a room that is over
				if (typeof history !== 'undefined' && window.location.search.includes('room=')) {
					const url = new URL(window.location.href)
					url.searchParams.delete('room')
					history.replaceState(null, '', url.toString())
				}
				break
			}
			case 'room':
				absorb(msg.snapshot)
				break
			case 'deal':
				roundId.current = newRoundId()
				roundLog.current = []
				missed.current = []
				setDone([])
				setWrong([])
				setWinners(null)
				setTarget(null)
				setFrozenMs(null)
				setBoard(msg.board)
				setPhase('dealing')
				onRoundStart?.()
				// cache this round's sounds, then say we are ready. The server
				// waits for everyone — but not forever, so a failure here must
				// still answer: an uncached prompt plays from the network.
				void (async () => {
					try {
						await preload(msg.board.map(promptUrl))
					} catch {
						// carry on: the round plays from the network
					}
					say({ type: 'ready', epoch: msg.epoch })
				})()
				break
			case 'go': {
				audio.unlock?.()
				const at = Date.now()
				setPhase('playing')
				setStartedAt(at)
				setTick(at)
				setFrozenMs(null)
				break
			}
			case 'target':
				targetAt.current = Date.now()
				missed.current = []
				setTarget(msg.code)
				setWrong([])
				// every client speaks it itself, in its own language
				void audio.play(promptUrl(msg.code))
				break
			case 'wrongTap':
				setPlayers(msg.players)
				// the 👎 already happened locally for the child who tapped; this
				// is how everyone else's scoreboard learns of it
				break
			case 'scored':
				noteTarget(msg.code, false)
				setPlayers(msg.players)
				setDone(d => (d.includes(msg.code) ? d : [...d, msg.code]))
				setTarget(null)
				setWrong([])
				setVotes({ votes: 0, needed: 0 })
				break
			case 'skipped':
				noteTarget(msg.code, true)
				setPlayers(msg.players)
				setDone(d => (d.includes(msg.code) ? d : [...d, msg.code]))
				setTarget(null)
				setWrong([])
				setVotes({ votes: 0, needed: 0 })
				break
			case 'skipVotes':
				setVotes({ votes: msg.votes, needed: msg.needed })
				break
			case 'roundEnded': {
				setPlayers(msg.players)
				setWinners(msg.winners)
				setFrozenMs(msg.elapsedMs)
				setPhase('finished')
				setTarget(null)
				audio.fx('complete')
				const targets = roundLog.current
				const mine = msg.players.find(p => p.playerId === meRef.current)
				const round: RoundResult = {
					id: roundId.current,
					solved: targets.length,
					total: boardRef.current.length,
					elapsedMs: msg.elapsedMs,
					mistakes: mine?.mistakes ?? 0,
					giveUps: targets.filter(t => t.gaveUp).length,
					// a courtyard round, labelled by the language it was heard in
					mode: `race:${opts.current.mode}`,
					board: boardRef.current,
					targets,
				}
				postRound(opts.current.app, round)
				break
			}
			case 'error':
				/*
				 * A seat the server will not honour is not an error to show a
				 * child — it is a room they are simply not in any more. (A
				 * socket that drops in the lobby is removed at once; only a
				 * round keeps a place warm.) Forget it and offer the door
				 * again, rather than leaving them knocking.
				 */
				if (msg.code === 'badToken' || msg.code === 'unknownRoom') {
					forgetSeat()
					seat.current = null
					tries.current = MAX_RESUME_TRIES
					setPhase('off')
					setError(null)
				} else {
					setError(msg.code)
				}
				break
			case 'bye':
				forgetSeat()
				seat.current = null
				tries.current = MAX_RESUME_TRIES // do not chase a room that is over
				setPhase(msg.reason === 'left' ? 'off' : 'lost')
				break
		}
	}, [absorb, noteTarget, say])

	useEffect(() => {
		opts.current = { app, playable, promptUrl, preload, audio, mode, onRoundStart }
		meRef.current = me
		targetRef.current = target
		boardRef.current = board
	})

	const connect = useCallback((first: ClientMsg) => {
		if (!SAHA.enabled) return
		ws.current?.close()
		setError(null)
		setPhase('connecting')
		const socket = new WebSocket(socketUrl())
		ws.current = socket
		socket.onopen = () => socket.send(JSON.stringify(first))
		socket.onmessage = e => {
			let msg: ServerMsg
			try {
				msg = JSON.parse(e.data as string) as ServerMsg
			} catch {
				return
			}
			// the two the room only tells this child about
			if (msg.type === 'scored' && msg.by === meRef.current) {
				opts.current.audio.fx('correct')
				flash('👍')
			}
			if (msg.type === 'wrongTap' && msg.playerId === meRef.current) {
				setWrong(w => (w.includes(msg.code) ? w : [...w, msg.code]))
			}
			handle(msg)
		}
		socket.onclose = () => {
			if (ws.current !== socket) return // already replaced
			setPhase(p => {
				if (p === 'off' || p === 'lost') return p
				// a dropped socket is usually a sleeping tablet, not a goodbye:
				// the seat is kept for a minute, so walk back in
				const back = seat.current
				if (back && tries.current < MAX_RESUME_TRIES) {
					tries.current += 1
					setTimeout(() => {
						reconnect.current?.({
							type: 'resume',
							room: back.room,
							playerId: back.playerId,
							token: back.token,
						})
					}, 400 * tries.current)
					return 'connecting'
				}
				forgetSeat()
				return 'lost'
			})
		}
	}, [flash, handle])

	// the same function the close handler reaches for, one render later
	useEffect(() => {
		reconnect.current = connect
	}, [connect])

	const create = useCallback((avatar: number) => {
		connect({
			type: 'create',
			app: opts.current.app,
			codes: opts.current.playable(),
			roundSize: 0,
			avatar,
		})
	}, [connect])

	const join = useCallback((code: string, avatar: number) => {
		connect({ type: 'join', room: code, codes: opts.current.playable(), avatar })
	}, [connect])

	const leave = useCallback(() => {
		say({ type: 'leave' })
		forgetSeat()
		seat.current = null
		tries.current = MAX_RESUME_TRIES
		ws.current?.close()
		ws.current = null
		opts.current.audio.stopSound()
		setPhase('off')
		setRoom('')
		setBoard([])
		setTarget(null)
		setDone([])
		setWrong([])
		setPlayers([])
		setWinners(null)
		setError(null)
	}, [say])

	// a reload with a seat still in this tab walks straight back in
	useEffect(() => {
		if (!available) return
		const back = recallSeat()
		if (back && phase === 'off' && !ws.current) {
			connect({ type: 'resume', room: back.room, playerId: back.playerId, token: back.token })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [available])

	useEffect(() => () => ws.current?.close(), [])

	const mine = players.find(p => p.playerId === me)
	const elapsedMs = frozenMs ?? (startedAt > 0 ? Math.max(0, tick - startedAt) : 0)

	return {
		/** multiplayer is configured, up, and its palettes are in hand */
		available: available && palettes !== null,
		palettes,
		phase,
		/** in a room, whatever it is doing */
		on: phase !== 'off' && phase !== 'lost',
		room,
		roomEmoji,
		me,
		hostId,
		isHost: me !== '' && me === hostId,
		players,
		board,
		target,
		done,
		wrong,
		winners,
		votes,
		error,
		feedback,
		elapsedMs,
		score: mine?.score ?? 0,
		mistakes: mine?.mistakes ?? 0,
		create,
		join,
		start: () => say({ type: 'start' }),
		/*
		 * A tap goes to the server, which decides who was first — but a miss
		 * needs no permission to be a miss. This client knows the target, so
		 * 👎 and the greyed card happen now, not in three hundred milliseconds.
		 * The server still hears the tap and tells the room, for the score.
		 */
		tap: (code: string) => {
			const asked = targetRef.current
			if (asked !== null && code !== asked && !wrong.includes(code)) {
				opts.current.audio.fx('wrong')
				flash('👎')
				missed.current = missed.current.includes(code)
					? missed.current
					: [...missed.current, code]
				setWrong(w => (w.includes(code) ? w : [...w, code]))
			}
			say({ type: 'tap', code })
		},
		skip: () => say({ type: 'skip' }),
		leave,
		/** the unhappy ending has been read; go back to the single-player app */
		dismiss: () => setPhase('off'),
	}
}

export type Race = ReturnType<typeof useRace>
