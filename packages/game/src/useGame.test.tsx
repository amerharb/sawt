// @vitest-environment jsdom
/*
 * The game state machine, tested through the public hook surface with a
 * mocked audio layer. Math.random is pinned to 0 throughout, so randomOf
 * always picks the first remaining item — rounds ask their targets in board
 * order, and every assertion can say exactly which code is up.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useGame } from './useGame'
import { postRound } from './sada'

vi.mock('./sada', () => ({ postRound: vi.fn() }))

type Item = { code: string }
const BOARD: Item[] = [{ code: 'a' }, { code: 'b' }, { code: 'c' }]

const audio = {
	stopSound: vi.fn(),
	play: vi.fn(),
	schedulePrompt: vi.fn(),
	cancelPrompt: vi.fn(),
	fx: vi.fn(),
	unlock: vi.fn(),
}

function gameHook(board: Item[] = BOARD, roundSize?: number) {
	return renderHook(() => useGame<Item>({
		canPlay: true,
		buildBoard: () => board,
		promptUrl: i => `/sound/${i.code}.aac`,
		preload: async () => {},
		audio,
		mode: 'test',
		roundSize,
	}))
}

const start = async (h: ReturnType<typeof gameHook>) => {
	await act(async () => {
		await h.result.current.startRound()
	})
}

beforeEach(() => {
	vi.spyOn(Math, 'random').mockReturnValue(0)
})

afterEach(() => {
	vi.restoreAllMocks()
	vi.clearAllMocks()
})

describe('entering game mode', () => {
	it('shows the board ready to play but starts nothing until ▶️', async () => {
		const h = gameHook()
		act(() => h.result.current.enterGame())
		expect(h.result.current.gameOn).toBe(true)
		expect(h.result.current.board.map(i => i.code)).toEqual(['a', 'b', 'c'])
		expect(h.result.current.target).toBeNull()      // no round running
		expect(h.result.current.elapsedMs).toBe(0)      // the clock sits at 0s
		expect(audio.play).not.toHaveBeenCalled()       // and nothing spoke
		await start(h)                                  // ▶️
		expect(h.result.current.target).toBe('a')
		expect(audio.play).toHaveBeenCalledWith('/sound/a.aac')
	})
})

describe('a round', () => {
	it('starts on the board it was given and asks the first target', async () => {
		const h = gameHook()
		expect(h.result.current.gameOn).toBe(false)
		await start(h)
		expect(h.result.current.gameOn).toBe(true)
		expect(h.result.current.board.map(i => i.code)).toEqual(['a', 'b', 'c'])
		expect(h.result.current.target).toBe('a')
		expect(audio.play).toHaveBeenCalledWith('/sound/a.aac')
	})

	it('advances on a correct guess and counts a wrong one without advancing', async () => {
		const h = gameHook()
		await start(h)
		act(() => h.result.current.guess('b'))            // wrong
		expect(h.result.current.target).toBe('a')
		expect(h.result.current.mistakes).toBe(1)
		expect(h.result.current.wrongGuesses).toEqual(['b'])
		act(() => h.result.current.guess('a'))            // right
		expect(h.result.current.solved).toEqual(['a'])
		expect(h.result.current.target).toBe('b')
		expect(h.result.current.wrongGuesses).toEqual([]) // cleared by the advance
	})

	it('a wrong item cannot be guessed again while the target is up', async () => {
		const h = gameHook()
		await start(h)
		act(() => h.result.current.guess('b'))
		act(() => h.result.current.guess('b'))
		expect(h.result.current.mistakes).toBe(1)
	})

	it('give-up counts separately and marks the code', async () => {
		const h = gameHook()
		await start(h)
		act(() => h.result.current.giveUp())
		expect(h.result.current.giveUps).toBe(1)
		expect(h.result.current.gaveUpCodes).toEqual(['a'])
		expect(h.result.current.mistakes).toBe(0)
		expect(h.result.current.target).toBe('b')
	})
})

describe('the round record', () => {
	it('records id, board, per-target wrongs and times when the round completes', async () => {
		const h = gameHook()
		await start(h)
		act(() => h.result.current.guess('c'))  // wrong for a
		act(() => h.result.current.guess('b'))  // wrong for a
		act(() => h.result.current.guess('a'))  // right
		act(() => h.result.current.giveUp())    // gives up b
		act(() => h.result.current.guess('c'))  // right — round complete
		const results = h.result.current.results
		expect(results).toHaveLength(1)
		const r = results[0]
		expect(r.id).toMatch(/^[0-9a-f-]{16,}$/i)
		expect(r.board).toEqual(['a', 'b', 'c'])
		expect(r).toMatchObject({ solved: 3, total: 3, mistakes: 2, giveUps: 1, mode: 'test' })
		expect(r.targets).toEqual([
			{ code: 'a', wrong: ['c', 'b'], gaveUp: false, ms: expect.any(Number) },
			{ code: 'b', wrong: [], gaveUp: true, ms: expect.any(Number) },
			{ code: 'c', wrong: [], gaveUp: false, ms: expect.any(Number) },
		])
		expect(r.targets.every(t => t.ms >= 0)).toBe(true)
		expect(audio.fx).toHaveBeenCalledWith('complete')
	})

	it('a stopped round records only what was resolved', async () => {
		const h = gameHook()
		await start(h)
		act(() => h.result.current.guess('a'))
		act(() => h.result.current.stopRound())
		const r = h.result.current.results[0]
		expect(r.solved).toBe(1)
		expect(r.targets.map(t => t.code)).toEqual(['a'])
		expect(h.result.current.gameOn).toBe(true) // stopping stays in game mode
		expect(h.result.current.target).toBeNull()
	})

	it('offers the finished round to sada when the app names itself', async () => {
		const h = renderHook(() => useGame<Item>({
			canPlay: true,
			buildBoard: () => BOARD,
			promptUrl: i => `/sound/${i.code}.aac`,
			preload: async () => {},
			audio,
			mode: 'test',
			app: 'flag',
		}))
		await start(h)
		act(() => h.result.current.stopRound())
		expect(postRound).toHaveBeenCalledTimes(1)
		expect(postRound).toHaveBeenCalledWith('flag', h.result.current.results[0])
		// while the app-less rounds of the other tests never called it
	})

	it('results survive leaving game mode and rounds get distinct ids', async () => {
		const h = gameHook()
		await start(h)
		act(() => h.result.current.stopRound())
		act(() => h.result.current.exitGame())
		expect(h.result.current.gameOn).toBe(false)
		expect(h.result.current.results).toHaveLength(1)
		await start(h)
		act(() => h.result.current.stopRound())
		const [r1, r2] = h.result.current.results
		expect(h.result.current.results).toHaveLength(2)
		expect(r1.id).not.toBe(r2.id)
	})
})

describe('roundSize', () => {
	it('asks only N targets, then the round is over', async () => {
		const h = gameHook(BOARD, 2)
		await start(h)
		expect(h.result.current.total).toBe(2)          // the score's denominator
		act(() => h.result.current.guess('a'))          // solved 1 of 2
		expect(h.result.current.target).toBe('b')
		act(() => h.result.current.giveUp())            // resolved 2 of 2 — done
		expect(h.result.current.target).toBeNull()
		const r = h.result.current.results[0]
		expect(r).toMatchObject({ solved: 2, total: 2, giveUps: 1 })
		expect(r.targets).toHaveLength(2)
		expect(r.board).toEqual(['a', 'b', 'c'])        // the board as shown, whole
		expect(audio.fx).toHaveBeenCalledWith('complete')
	})

	it('larger than the board just plays the whole board', async () => {
		const h = gameHook(BOARD, 99)
		await start(h)
		expect(h.result.current.total).toBe(3)
	})

	it('a setting change reaches the ready state, but never a played round', async () => {
		const h = renderHook(({ size }) => useGame<Item>({
			canPlay: true,
			buildBoard: () => BOARD,
			promptUrl: i => `/sound/${i.code}.aac`,
			preload: async () => {},
			audio,
			mode: 'test',
			roundSize: size,
		}), { initialProps: { size: 2 } })
		act(() => h.result.current.enterGame())
		expect(h.result.current.total).toBe(2)     // ready state shows 0/2
		h.rerender({ size: 3 })
		expect(h.result.current.total).toBe(3)     // …and follows the setting
		await act(async () => { await h.result.current.startRound() })
		act(() => h.result.current.guess('a'))
		h.rerender({ size: 2 })
		expect(h.result.current.total).toBe(3)     // a running round is frozen
	})
})

describe('sweepSolved', () => {
	it('moves the solved to the end as a stable partition', async () => {
		const five = [{ code: 'a' }, { code: 'b' }, { code: 'c' }, { code: 'd' }, { code: 'e' }]
		const h = gameHook(five)
		await start(h)
		act(() => h.result.current.guess('a'))  // target a solved
		act(() => h.result.current.giveUp())    // target b given up
		act(() => h.result.current.sweepSolved())
		// unsolved keep their order up front, solved slide to the end in theirs
		expect(h.result.current.board.map(i => i.code)).toEqual(['c', 'd', 'e', 'a', 'b'])
	})

	it('does nothing when nothing is solved', async () => {
		const h = gameHook()
		await start(h)
		act(() => h.result.current.sweepSolved())
		expect(h.result.current.board.map(i => i.code)).toEqual(['a', 'b', 'c'])
	})
})
