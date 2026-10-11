// @vitest-environment jsdom
/*
 * The settings hook against a mocked wire: which copy wins at sign-in, what
 * a change sends and when, and what it never sends back.
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { renderHook, act, cleanup } from '@testing-library/react'
import { useBaabSettings, SAVE_AFTER_MS } from './useBaabSettings'
import type { Session } from './useBaab'
import * as baab from './baab'

vi.mock('./baab', () => ({
	BAAB: { enabled: true, baseUrl: 'https://baab.test' },
	fetchAppSettings: vi.fn(),
	putAppSettings: vi.fn(),
}))

const mocked = vi.mocked(baab)
const IN: Session = { state: 'in', profile: { handle: 'K7Q4-X2M9', nickname: null } }
const OUT: Session = { state: 'out' }

const MINE = { theme: 'dark', hiddenColors: ['000'] }
const THEIRS = { theme: 'light', hiddenColors: ['fff'] }

// let baab's answers (resolved promises) land
const settle = () => act(async () => {
	await Promise.resolve()
	await Promise.resolve()
	await Promise.resolve()
})

const setup = (session: Session) => {
	const apply = vi.fn()
	const read = vi.fn(() => MINE)
	const h = renderHook(({ s }) => useBaabSettings('color', s, { read, apply }), { initialProps: { s: session } })
	return { ...h, apply, read }
}

beforeEach(() => {
	vi.useFakeTimers()
	mocked.fetchAppSettings.mockResolvedValue({})
	mocked.putAppSettings.mockResolvedValue(true)
})

afterEach(() => {
	cleanup()
	vi.useRealTimers()
	vi.clearAllMocks()
})

describe('useBaabSettings', () => {
	it('does nothing while nobody is signed in', async () => {
		const { result } = setup(OUT)
		await settle()
		act(() => result.current.save(MINE))
		await act(async () => { vi.advanceTimersByTime(SAVE_AFTER_MS * 2) })
		expect(mocked.fetchAppSettings).not.toHaveBeenCalled()
		expect(mocked.putAppSettings).not.toHaveBeenCalled()
	})

	it('takes the account\'s settings at sign-in', async () => {
		mocked.fetchAppSettings.mockResolvedValue(THEIRS)
		const { apply } = setup(IN)
		await settle()
		expect(mocked.fetchAppSettings).toHaveBeenCalledWith('color')
		expect(apply).toHaveBeenCalledWith(THEIRS)
		expect(mocked.putAppSettings).not.toHaveBeenCalled()
	})

	it('seeds an account that never saved with this device\'s settings', async () => {
		const { apply } = setup(IN)
		await settle()
		expect(apply).not.toHaveBeenCalled()
		expect(mocked.putAppSettings).toHaveBeenCalledWith('color', MINE)
	})

	it('asks again when a player signs in after the page loaded', async () => {
		mocked.fetchAppSettings.mockResolvedValue(THEIRS)
		const { apply, rerender } = setup(OUT)
		await settle()
		expect(mocked.fetchAppSettings).not.toHaveBeenCalled()
		rerender({ s: IN })
		await settle()
		expect(apply).toHaveBeenCalledWith(THEIRS)
	})

	it('sends a run of changes once, a moment after the last', async () => {
		const { result } = setup(IN)
		await settle()
		mocked.putAppSettings.mockClear()
		act(() => {
			result.current.save({ theme: 'dark', hiddenColors: ['000'] })
			result.current.save({ theme: 'dark', hiddenColors: ['000', '00f'] })
		})
		expect(mocked.putAppSettings).not.toHaveBeenCalled()
		await act(async () => { vi.advanceTimersByTime(SAVE_AFTER_MS) })
		expect(mocked.putAppSettings).toHaveBeenCalledTimes(1)
		expect(mocked.putAppSettings).toHaveBeenCalledWith('color', { theme: 'dark', hiddenColors: ['000', '00f'] })
	})

	it('does not send back what it just took from baab', async () => {
		mocked.fetchAppSettings.mockResolvedValue(THEIRS)
		const { result } = setup(IN)
		await settle()
		act(() => result.current.save(THEIRS))
		await act(async () => { vi.advanceTimersByTime(SAVE_AFTER_MS) })
		expect(mocked.putAppSettings).not.toHaveBeenCalled()
	})

	it('takes another device\'s change when the tab is looked at again', async () => {
		const { apply } = setup(IN)
		await settle()
		mocked.fetchAppSettings.mockResolvedValue(THEIRS)
		await act(async () => { document.dispatchEvent(new Event('visibilitychange')) })
		await settle()
		expect(apply).toHaveBeenCalledWith(THEIRS)
	})

	it('keeps a change of its own that is still on its way', async () => {
		const { result, apply } = setup(IN)
		await settle()
		mocked.fetchAppSettings.mockResolvedValue(THEIRS)
		act(() => result.current.save(MINE))
		await act(async () => { document.dispatchEvent(new Event('visibilitychange')) })
		await settle()
		expect(apply).not.toHaveBeenCalled()
	})

	it('goes on with its own copy when baab is silent', async () => {
		mocked.fetchAppSettings.mockRejectedValue(new Error('offline'))
		const { apply } = setup(IN)
		await settle()
		expect(apply).not.toHaveBeenCalled()
		expect(mocked.putAppSettings).not.toHaveBeenCalled()
	})
})
