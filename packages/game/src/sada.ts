/*
 * sada (صدى — the echo): the game-data collector's client side.
 *
 * The apps record rich RoundResults (see useGame); sada is the backend that
 * receives them. This module holds the shared configuration and the sender.
 *
 * Env, set per deployment (e.g. in Vercel) or in a local .env.local:
 *   VITE_SADA_ENABLED=true                the on/off switch (default: off)
 *   VITE_SADA_URL=https://sada.sawt.info  the collector's base URL
 *
 * Both are required to enable. A missing switch, a missing URL or a
 * malformed one all leave sada off, so a misconfigured build degrades to
 * exactly today's behavior: round data stays in the browser. Dev builds get
 * no special treatment — unlike SHOW_BETA, nothing turns on by itself.
 *
 * Sending is best-effort and health-gated: a round goes out only when a
 * recent GET /health said the collector is up. Health is asked at most
 * once per 10 minutes — never once-per-send — and the verdict (either way)
 * is cached for that long, so a dead collector costs the player one aborted
 * probe every 10 minutes and nothing else. Failures of any kind are
 * swallowed: analytics must never break the game.
 */
import type { RoundResult } from './useGame'
export type SadaConfig = {
	// true only when the switch is set AND the URL is usable
	enabled: boolean,
	// base URL without a trailing slash — endpoints hang off `${baseUrl}/v1/…`;
	// empty string when disabled or malformed
	baseUrl: string,
}

const raw = (import.meta.env.VITE_SADA_URL ?? '').trim().replace(/\/+$/, '')
const wellFormed = /^https?:\/\/[^\s/]+/.test(raw)

export const SADA: SadaConfig = {
	enabled: import.meta.env.VITE_SADA_ENABLED === 'true' && wellFormed,
	baseUrl: wellFormed ? raw : '',
}

// how long one health verdict — healthy or not — is trusted
const HEALTH_TTL_MS = 10 * 60 * 1000
// a health probe that hangs is a "down" answer, not a wait
const HEALTH_TIMEOUT_MS = 4000

let health: { ok: boolean, at: number } = { ok: false, at: -Infinity }
let probing: Promise<boolean> | null = null

const probe = async (): Promise<boolean> => {
	try {
		const signal = typeof AbortSignal.timeout === 'function'
			? AbortSignal.timeout(HEALTH_TIMEOUT_MS)
			: undefined
		const res = await fetch(`${SADA.baseUrl}/health`, { signal })
		return res.ok
	} catch {
		return false
	}
}

/*
 * The cached health of the collector, refreshed at most every 10 minutes.
 * Concurrent callers during a probe share the same request.
 */
export async function sadaHealthy(): Promise<boolean> {
	if (!SADA.enabled) return false
	if (Date.now() - health.at < HEALTH_TTL_MS) return health.ok
	probing ??= probe().then(ok => {
		health = { ok, at: Date.now() }
		probing = null
		return ok
	})
	return probing
}

/*
 * One fire-and-forget POST behind the health gate: the game never waits on
 * it and never hears about failures. `keepalive` lets a payload posted right
 * before the tab closes still leave the building.
 */
const post = (path: string, body: unknown): void => {
	if (!SADA.enabled) return
	void (async () => {
		try {
			if (!(await sadaHealthy())) return
			await fetch(`${SADA.baseUrl}${path}`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(body),
				keepalive: true,
			})
		} catch {
			// analytics must never break the game
		}
	})()
}

// offer a finished round to the collector
export function postRound(app: string, round: RoundResult): void {
	post('/v1/rounds', { app, round })
}

/*
 * A language-choice ping: which interface and hearing language the app was
 * switched to (anthem's hearing choice is its music type). Field names are
 * the collector's contract — snake_case.
 */
export function postSettings(app: string, uiLanguage: string, soundLanguage: string): void {
	post('/v1/settings', { app, ui_language: uiLanguage, sound_language: soundLanguage })
}
