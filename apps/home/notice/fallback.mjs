/*
 * Where an address under /privacy goes when it is not one of the notice's
 * pages: /privacy/en, the English. Every language has a page of its own at
 * /privacy/<code> — /privacy/en, /ar, /de, /sv — and /privacy itself,
 * /privacy/xx or anything else under it is sent on to the English one.
 *
 * One rule, made from notice/languages.json, for both servers that show the
 * notice: Vercel's, where tools/privacy.mjs writes it into vercel.json as
 * redirects — Vercel weighs redirects before its files, so the rule has to
 * leave the languages' own pages alone — and Vite's, in dev and preview,
 * where vite.config.ts serves the same redirect. A redirect, not a page of
 * English at the wrong address, so the address bar says what is shown; and
 * a temporary one, so no browser holds on to it if a language is added or
 * /privacy one day picks a language of its own.
 */

// the English notice, where every other address under /privacy is sent
export const DEFAULT_PAGE = '/privacy/en'

// what the rest of the path may be and still be a page: a language's code,
// with .html (cleanUrls makes that the clean address) or a trailing slash
const page = languages =>
	`(?:${languages.map(l => l.code).join('|')})(?:\\.html)?/?$`

// the rules as vercel.json carries them: /privacy itself, then the rest
export const vercelRedirects = languages => [
	{ source: '/privacy', destination: DEFAULT_PAGE, permanent: false },
	{ source: `/privacy/((?!${page(languages)}).*)`, destination: DEFAULT_PAGE, permanent: false },
]

// the same rules for one path: where it should go instead, or null to serve it
export function fallback(languages, pathname) {
	if (pathname === '/privacy') return DEFAULT_PAGE
	const rest = /^\/privacy\/(.*)$/.exec(pathname)?.[1]
	if (rest === undefined) return null
	return new RegExp(`^${page(languages)}`).test(rest) ? null : DEFAULT_PAGE
}
