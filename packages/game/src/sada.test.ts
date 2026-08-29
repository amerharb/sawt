/*
 * The sada configuration is env-driven and evaluated at module load, so each
 * case stubs the env and imports a fresh copy of the module.
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import type { RoundResult } from './useGame'

const loadModule = async (enabled?: string, url?: string) => {
	vi.unstubAllEnvs() // a fresh env every time — stubs must not leak between loads
	vi.resetModules()
	if (enabled !== undefined) vi.stubEnv('VITE_SADA_ENABLED', enabled)
	if (url !== undefined) vi.stubEnv('VITE_SADA_URL', url)
	return await import('./sada')
}
const load = async (enabled?: string, url?: string) => (await loadModule(enabled, url)).SADA

afterEach(() => {
	vi.unstubAllEnvs()
	vi.restoreAllMocks()
	vi.useRealTimers()
})

describe('SADA config', () => {
	it('is off by default — no env, no sending', async () => {
		const sada = await load()
		expect(sada).toEqual({ enabled: false, baseUrl: '' })
	})

	it('needs BOTH the switch and a well-formed url', async () => {
		expect((await load('true')).enabled).toBe(false)               // switch alone
		expect((await load(undefined, 'https://sada.sawt.info')).enabled).toBe(false) // url alone
		expect((await load('yes', 'https://sada.sawt.info')).enabled).toBe(false)     // not the literal 'true'
		expect((await load('true', 'sada.sawt.info')).enabled).toBe(false)            // no protocol
		const on = await load('true', 'https://sada.sawt.info')
		expect(on).toEqual({ enabled: true, baseUrl: 'https://sada.sawt.info' })
	})

	it('normalizes the base url: trims and drops trailing slashes', async () => {
		const sada = await load('true', ' https://sada.sawt.info/// '.trim() + '///')
		expect(sada.baseUrl).toBe('https://sada.sawt.info')
	})
})

const ROUND: RoundResult = {
	id: 'r1', solved: 1, total: 1, elapsedMs: 5, mistakes: 0, giveUps: 0,
	mode: 'en', board: ['a'], targets: [{ code: 'a', wrong: [], gaveUp: false, ms: 5 }],
}

// resolve postRound's fire-and-forget chain
const flush = () => new Promise(r => setTimeout(r, 0))

const stubFetch = (healthOk: boolean) => {
	const calls: { url: string, init?: RequestInit }[] = []
	vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
		calls.push({ url, init })
		return { ok: url.endsWith('/health') ? healthOk : true } as Response
	}))
	return calls
}

describe('postRound', () => {
	it('does nothing at all when sada is disabled', async () => {
		const calls = stubFetch(true)
		const { postRound } = await loadModule()
		postRound('flag', ROUND)
		await flush()
		expect(calls).toHaveLength(0)
	})

	it('checks health first, then posts — and never re-checks within the TTL', async () => {
		const calls = stubFetch(true)
		const { postRound } = await loadModule('true', 'https://sada.test')
		postRound('flag', ROUND)
		await flush()
		postRound('map', ROUND)
		await flush()
		expect(calls.map(c => c.url)).toEqual([
			'https://sada.test/health',       // once, before anything is sent
			'https://sada.test/v1/rounds',
			'https://sada.test/v1/rounds',
		])
		expect(calls[1].init?.method).toBe('POST')
		expect(JSON.parse(calls[1].init?.body as string)).toEqual({ app: 'flag', round: ROUND })
	})

	it('sends nothing while unhealthy, and asks again only after 10 minutes', async () => {
		vi.useFakeTimers()
		const calls = stubFetch(false)
		const { postRound } = await loadModule('true', 'https://sada.test')
		postRound('flag', ROUND)
		await vi.advanceTimersByTimeAsync(0)
		postRound('flag', ROUND)              // within the TTL: no new probe
		await vi.advanceTimersByTimeAsync(0)
		expect(calls.map(c => c.url)).toEqual(['https://sada.test/health'])
		await vi.advanceTimersByTimeAsync(10 * 60 * 1000 + 1)
		postRound('flag', ROUND)              // TTL over: one fresh probe
		await vi.advanceTimersByTimeAsync(0)
		expect(calls.map(c => c.url)).toEqual([
			'https://sada.test/health',
			'https://sada.test/health',
		])
	})

	it('a health probe that throws counts as down and stays quiet', async () => {
		vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline') }))
		const { postRound, sadaHealthy } = await loadModule('true', 'https://sada.test')
		postRound('flag', ROUND)
		await flush()
		expect(await sadaHealthy()).toBe(false)
		expect(fetch).toHaveBeenCalledTimes(1) // the probe; no round left the building
	})
})
