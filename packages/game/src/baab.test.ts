/*
 * The baab configuration is env-driven and evaluated at module load, so each
 * case stubs the env and imports a fresh copy of the module — the sada
 * tests' pattern.
 */
import { describe, it, expect, vi, afterEach } from 'vitest'

const loadModule = async (enabled?: string, url?: string) => {
	vi.unstubAllEnvs()
	vi.resetModules()
	if (enabled !== undefined) vi.stubEnv('VITE_BAAB_ENABLED', enabled)
	if (url !== undefined) vi.stubEnv('VITE_BAAB_URL', url)
	return await import('./baab')
}
const on = () => loadModule('true', 'https://baab.test')

afterEach(() => {
	vi.unstubAllEnvs()
	vi.restoreAllMocks()
})

// a door that answers each path with a given status, remembering what it was asked
const stubDoor = (answers: Record<string, { status: number, body?: unknown } | Error>) => {
	const calls: { url: string, init?: RequestInit }[] = []
	vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
		calls.push({ url, init })
		const path = new URL(url).pathname
		const answer = answers[path] ?? { status: 404 }
		if (answer instanceof Error) throw answer
		return {
			ok: answer.status >= 200 && answer.status < 300,
			status: answer.status,
			json: async () => answer.body,
		} as Response
	}))
	return calls
}

const PROFILE = { handle: 'K7Q4-X2M9', nickname: null, settings: {} }

describe('BAAB config', () => {
	it('is off by default — no env, nothing asked', async () => {
		const { BAAB } = await loadModule()
		expect(BAAB).toEqual({ enabled: false, baseUrl: '' })
	})

	it('needs BOTH the switch and a well-formed url, and normalizes the url', async () => {
		expect((await loadModule('true')).BAAB.enabled).toBe(false)
		expect((await loadModule(undefined, 'https://baab.sawt.info')).BAAB.enabled).toBe(false)
		expect((await loadModule('true', 'baab.sawt.info')).BAAB.enabled).toBe(false)
		const { BAAB } = await loadModule('true', ' https://baab.sawt.info/// '.trim() + '//')
		expect(BAAB).toEqual({ enabled: true, baseUrl: 'https://baab.sawt.info' })
	})

	it('asks nothing at all while off', async () => {
		const calls = stubDoor({})
		const { fetchProfile, requestCode, verifyCode, logout, saveNickname } = await loadModule()
		expect(await fetchProfile()).toBeNull()
		expect(await requestCode('a@b.co', 'home')).toBe('down')
		expect(await verifyCode('a@b.co', '123456')).toBe('down')
		await logout()
		expect(await saveNickname('x')).toBe(false)
		expect(calls).toHaveLength(0)
	})
})

describe('fetchProfile', () => {
	it('carries the cookie and returns the profile', async () => {
		const calls = stubDoor({ '/v1/profile': { status: 200, body: PROFILE } })
		const { fetchProfile } = await on()
		expect(await fetchProfile()).toEqual(PROFILE)
		expect(calls[0].url).toBe('https://baab.test/v1/profile')
		expect(calls[0].init?.credentials).toBe('include')
	})

	it('reads a 401 as nobody, and throws when the door does not answer', async () => {
		stubDoor({ '/v1/profile': { status: 401 } })
		expect(await (await on()).fetchProfile()).toBeNull()
		stubDoor({ '/v1/profile': { status: 500 } })
		await expect((await on()).fetchProfile()).rejects.toThrow()
		stubDoor({ '/v1/profile': new Error('offline') })
		await expect((await on()).fetchProfile()).rejects.toThrow()
	})
})

describe('requestCode', () => {
	it('posts the trimmed email with the asking app, and names each outcome', async () => {
		const calls = stubDoor({ '/v1/login': { status: 200 } })
		const { requestCode } = await on()
		expect(await requestCode('  parent@example.com ', 'home')).toBe('sent')
		expect(calls[0].init?.method).toBe('POST')
		expect(calls[0].init?.credentials).toBe('include')
		expect(JSON.parse(calls[0].init?.body as string)).toEqual({ email: 'parent@example.com', app: 'home' })

		stubDoor({ '/v1/login': { status: 429 } })
		expect(await (await on()).requestCode('a@b.co', 'home')).toBe('wait')
		stubDoor({ '/v1/login': { status: 422 } })
		expect(await (await on()).requestCode('a@b.co', 'home')).toBe('refused')
		stubDoor({ '/v1/login': new Error('offline') })
		expect(await (await on()).requestCode('a@b.co', 'home')).toBe('down')
	})
})

describe('verifyCode and verifyToken', () => {
	it('spend a code with its email, or a token alone', async () => {
		const calls = stubDoor({ '/v1/verify': { status: 200, body: { status: 'ok' } } })
		const { verifyCode, verifyToken } = await on()
		expect(await verifyCode('a@b.co', ' 123456 ')).toBe('in')
		expect(JSON.parse(calls[0].init?.body as string)).toEqual({ email: 'a@b.co', code: '123456' })
		expect(await verifyToken('tok')).toBe('in')
		expect(JSON.parse(calls[1].init?.body as string)).toEqual({ token: 'tok' })
	})

	it('read a refusal as wrong — whatever the reason — and silence as down', async () => {
		stubDoor({ '/v1/verify': { status: 401 } })
		expect(await (await on()).verifyCode('a@b.co', '000000')).toBe('wrong')
		stubDoor({ '/v1/verify': { status: 422 } })
		expect(await (await on()).verifyToken('')).toBe('wrong')
		stubDoor({ '/v1/verify': { status: 503 } })
		expect(await (await on()).verifyToken('tok')).toBe('down')
	})
})

describe('logout and saveNickname', () => {
	it('logout posts and swallows a silent door', async () => {
		const calls = stubDoor({ '/v1/logout': new Error('offline') })
		await (await on()).logout()
		expect(calls[0].url).toBe('https://baab.test/v1/logout')
		expect(calls[0].init?.method).toBe('POST')
	})

	it('saveNickname puts the trimmed name and says whether the door took it', async () => {
		const calls = stubDoor({ '/v1/profile': { status: 204 } })
		expect(await (await on()).saveNickname(' the sawt kid ')).toBe(true)
		expect(calls[0].init?.method).toBe('PUT')
		expect(JSON.parse(calls[0].init?.body as string)).toEqual({ nickname: 'the sawt kid' })
		stubDoor({ '/v1/profile': { status: 422 } })
		expect(await (await on()).saveNickname('')).toBe(false)
	})
})
