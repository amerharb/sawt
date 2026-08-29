/*
 * The sada configuration is env-driven and evaluated at module load, so each
 * case stubs the env and imports a fresh copy. Only the gating is under test
 * here — there is no sender yet.
 */
import { describe, it, expect, vi, afterEach } from 'vitest'

const load = async (enabled?: string, url?: string) => {
	vi.unstubAllEnvs() // a fresh env every time — stubs must not leak between loads
	vi.resetModules()
	if (enabled !== undefined) vi.stubEnv('VITE_SADA_ENABLED', enabled)
	if (url !== undefined) vi.stubEnv('VITE_SADA_URL', url)
	return (await import('./sada')).SADA
}

afterEach(() => {
	vi.unstubAllEnvs()
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
