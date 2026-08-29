/*
 * sada (صدى — the echo): the game-data collector's client-side configuration.
 *
 * The apps already record rich RoundResults (see useGame); sada is the
 * backend that will receive them. This module is ONLY the configuration —
 * one reading of the build's env that every app shares, deciding whether
 * sending is allowed at all and where it would go. The sender itself (a
 * postRound() honoring flight mode) and the health check come later.
 *
 * Env, set per deployment (e.g. in Vercel) or in a local .env.local:
 *   VITE_SADA_ENABLED=true                the on/off switch (default: off)
 *   VITE_SADA_URL=https://sada.sawt.info  the collector's base URL
 *
 * Both are required to enable. A missing switch, a missing URL or a
 * malformed one all leave sada off, so a misconfigured build degrades to
 * exactly today's behavior: round data stays in the browser. Dev builds get
 * no special treatment — unlike SHOW_BETA, nothing turns on by itself.
 */
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
