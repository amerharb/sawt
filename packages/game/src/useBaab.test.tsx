// @vitest-environment jsdom
/*
 * The hook against a mocked wire: what it asks on mount, what a magic link
 * does to the address bar, and how the four actions move the session.
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { renderHook, act, waitFor, cleanup } from '@testing-library/react'
import { useBaab, takeLoginToken } from './useBaab'
import * as baab from './baab'

vi.mock('./baab', () => ({
	BAAB: { enabled: true, baseUrl: 'https://baab.test' },
	fetchProfile: vi.fn(),
	requestCode: vi.fn(),
	verifyCode: vi.fn(),
	verifyToken: vi.fn(),
	logout: vi.fn(),
	saveNickname: vi.fn(),
}))

const mocked = vi.mocked(baab)
const PROFILE = { handle: 'K7Q4-X2M9', nickname: null, settings: {} }

beforeEach(() => {
	window.history.replaceState(null, '', '/')
	mocked.fetchProfile.mockResolvedValue(null)
	mocked.logout.mockResolvedValue()
})

// globals are off, so cleanup() is called by hand — it unmounts each case's
// hook, and with it the visibilitychange listener the next case must not hear
afterEach(() => {
	cleanup()
	vi.clearAllMocks()
})

describe('takeLoginToken', () => {
	it('takes ?login= out of the address bar and keeps the rest', () => {
		window.history.replaceState(null, '', '/?l=ar&login=tok-123&t=dark')
		expect(takeLoginToken()).toBe('tok-123')
		expect(window.location.search).toBe('?l=ar&t=dark')
		expect(takeLoginToken()).toBeNull()      // gone: a reload cannot replay it
	})
})

describe('useBaab', () => {
	it('starts unknown, asks who is in, and settles', async () => {
		mocked.fetchProfile.mockResolvedValue(PROFILE)
		const h = renderHook(() => useBaab('home'))
		expect(h.result.current.session).toEqual({ state: 'unknown' })
		await waitFor(() => expect(h.result.current.session).toEqual({ state: 'in', profile: PROFILE }))
		expect(mocked.fetchProfile).toHaveBeenCalled()
	})

	it('reads a silent door as out — for now', async () => {
		mocked.fetchProfile.mockRejectedValue(new Error('offline'))
		const h = renderHook(() => useBaab('home'))
		await waitFor(() => expect(h.result.current.session).toEqual({ state: 'out' }))
	})

	it('asks nothing when the page does not want it', async () => {
		const h = renderHook(() => useBaab('home', false))
		expect(h.result.current.session).toEqual({ state: 'out' })
		await act(async () => {})
		expect(mocked.fetchProfile).not.toHaveBeenCalled()
	})

	it('spends a magic link before asking who is in, and says how it went', async () => {
		window.history.replaceState(null, '', '/?login=tok-123')
		mocked.verifyToken.mockResolvedValue('in')
		mocked.fetchProfile.mockResolvedValue(PROFILE)
		const h = renderHook(() => useBaab('home'))
		await waitFor(() => expect(h.result.current.arrival).toBe('in'))
		await waitFor(() => expect(h.result.current.session).toEqual({ state: 'in', profile: PROFILE }))
		expect(mocked.verifyToken).toHaveBeenCalledWith('tok-123')
		expect(mocked.verifyToken.mock.invocationCallOrder[0]).toBeLessThan(mocked.fetchProfile.mock.invocationCallOrder[0])
		expect(window.location.search).toBe('')
		act(() => h.result.current.settle())
		expect(h.result.current.arrival).toBeNull()
	})

	it('knock: a code sent — or one already out — moves to the code step; a refusal does not', async () => {
		const h = renderHook(() => useBaab('home'))
		await waitFor(() => expect(h.result.current.session).toEqual({ state: 'out' }))

		mocked.requestCode.mockResolvedValue('refused')
		await act(async () => { expect(await h.result.current.knock('nope')).toBe('refused') })
		expect(h.result.current.pending).toBeNull()

		mocked.requestCode.mockResolvedValue('wait')
		await act(async () => { await h.result.current.knock(' a@b.co ') })
		expect(h.result.current.pending).toBe('a@b.co')
		expect(mocked.requestCode).toHaveBeenLastCalledWith(' a@b.co ', 'home')

		act(() => h.result.current.forget())
		expect(h.result.current.pending).toBeNull()
	})

	it('enter: the right code signs in and clears the step; a wrong one changes nothing', async () => {
		const h = renderHook(() => useBaab('home'))
		await waitFor(() => expect(h.result.current.session).toEqual({ state: 'out' }))
		mocked.requestCode.mockResolvedValue('sent')
		await act(async () => { await h.result.current.knock('a@b.co') })

		mocked.verifyCode.mockResolvedValue('wrong')
		await act(async () => { expect(await h.result.current.enter('000000')).toBe('wrong') })
		expect(h.result.current.pending).toBe('a@b.co')
		expect(h.result.current.session).toEqual({ state: 'out' })

		mocked.verifyCode.mockResolvedValue('in')
		mocked.fetchProfile.mockResolvedValue(PROFILE)
		await act(async () => { expect(await h.result.current.enter('123456')).toBe('in') })
		expect(mocked.verifyCode).toHaveBeenCalledWith('a@b.co', '123456')
		expect(h.result.current.pending).toBeNull()
		expect(h.result.current.session).toEqual({ state: 'in', profile: PROFILE })
	})

	it('rename keeps the door’s answer; leave signs out here whatever the door said', async () => {
		mocked.fetchProfile.mockResolvedValue(PROFILE)
		const h = renderHook(() => useBaab('home'))
		await waitFor(() => expect(h.result.current.session.state).toBe('in'))

		mocked.saveNickname.mockResolvedValue(false)
		await act(async () => { expect(await h.result.current.rename('x')).toBe(false) })
		expect(h.result.current.session).toEqual({ state: 'in', profile: PROFILE })

		mocked.saveNickname.mockResolvedValue(true)
		await act(async () => { await h.result.current.rename(' the sawt kid ') })
		expect(h.result.current.session).toEqual({ state: 'in', profile: { ...PROFILE, nickname: 'the sawt kid' } })

		mocked.logout.mockRejectedValue(new Error('offline'))
		await act(async () => { await h.result.current.leave().catch(() => {}) })
		expect(mocked.logout).toHaveBeenCalled()
	})

	it('asks again when the tab is looked at, and keeps a known session through a silent door', async () => {
		mocked.fetchProfile.mockResolvedValue(PROFILE)
		const h = renderHook(() => useBaab('home'))
		await waitFor(() => expect(h.result.current.session.state).toBe('in'))

		mocked.fetchProfile.mockRejectedValue(new Error('offline'))
		await act(async () => { document.dispatchEvent(new Event('visibilitychange')) })
		expect(mocked.fetchProfile).toHaveBeenCalledTimes(2)
		expect(h.result.current.session.state).toBe('in')   // the cookie is still there

		mocked.fetchProfile.mockResolvedValue(null)          // signed out elsewhere in the family
		await act(async () => { document.dispatchEvent(new Event('visibilitychange')) })
		expect(h.result.current.session).toEqual({ state: 'out' })
	})
})
