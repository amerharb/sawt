#!/usr/bin/env node
/*
 * Write the privacy notice in every language it has, from one template and
 * one file of texts per language:
 *
 *     node tools/privacy.mjs           # write privacy.html and privacy/<code>.html
 *     node tools/privacy.mjs --check   # fail if any written page is stale
 *
 * notice/template.html holds the page; notice/<code>.json its texts, keyed
 * by the {{name}} each fills (a text may carry inline HTML); and
 * notice/languages.json the languages, in the order the switcher lists
 * them. Every language lives at /privacy/<code> — English, the first, at
 * /privacy/en — so a page is plain HTML at an address of its own: no
 * script picks a language, and a link always shows the same words.
 *
 * The pages are committed so a reader sees what ships, and the build runs
 * the check, so a text changed without writing the pages cannot be
 * published. A text file with a key the template lacks, or the template
 * with a key a text file lacks, is an error rather than a gap.
 *
 * It also writes, and checks, the redirects in vercel.json that send
 * /privacy itself, and an address for a language the notice is not written
 * in, to /privacy/en (notice/fallback.mjs), so adding a language moves the
 * rule with it.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { vercelRedirects, DEFAULT_PAGE } from '../notice/fallback.mjs'

const HOME = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://sawt.info'
const check = process.argv.includes('--check')

const languages = JSON.parse(readFileSync(join(HOME, 'notice/languages.json'), 'utf8'))
const template = readFileSync(join(HOME, 'notice/template.html'), 'utf8')

const pathOf = code => `/privacy/${code}`
const fileOf = code => `privacy/${code}.html`

// what the template asks the texts for; the page itself fills the rest
const FILLED = new Set(['lang', 'dir', 'canonical', 'alternates', 'switcher', 'translationNote', 'generated'])
const wanted = new Set([...template.matchAll(/\{\{([\w.]+)\}\}/g)].map(m => m[1]).filter(k => !FILLED.has(k)))

const alternates = [
	...languages.map(l => `\t<link rel="alternate" hreflang="${l.code}" href="${SITE}${pathOf(l.code)}"/>`),
	`\t<link rel="alternate" hreflang="x-default" href="${SITE}${pathOf(languages[0].code)}"/>`,
].join('\n')

let stale = 0
for (const language of languages) {
	const texts = JSON.parse(readFileSync(join(HOME, `notice/${language.code}.json`), 'utf8'))
	const given = new Set(Object.keys(texts).filter(k => k !== 'translation' && k !== 'languages'))
	const missing = [...wanted].filter(k => !given.has(k))
	const extra = [...given].filter(k => !wanted.has(k))
	if (missing.length || extra.length) {
		console.error(`notice/${language.code}.json: missing ${missing.join(', ') || '—'}; not in the template ${extra.join(', ') || '—'}`)
		process.exit(1)
	}

	// the other languages as plain links, this one marked as the page
	const items = languages.map(l => (l.code === language.code
		? `<span aria-current="page" lang="${l.code}">${l.name}</span>`
		: `<a href="${pathOf(l.code)}" hreflang="${l.code}" lang="${l.code}">${l.name}</a>`))
	const switcher = `\t<nav class="notice-languages" aria-label="${texts.languages}">\n\t\t${items.join('\n\t\t<span aria-hidden="true">·</span>\n\t\t')}\n\t</nav>`
	const translationNote = texts.translation ? `\t<p class="notice-translation">${texts.translation}</p>\n` : ''

	const fills = {
		...texts,
		lang: language.code,
		dir: language.dir,
		canonical: `${SITE}${pathOf(language.code)}`,
		alternates,
		switcher,
		translationNote,
		generated: `Written by tools/privacy.mjs from notice/template.html and notice/${language.code}.json — edit those, then run \`npm run privacy -w home\`.`,
	}
	const page = template.replace(/\{\{([\w.]+)\}\}/g, (_, key) => fills[key])
		// a note that is empty leaves no blank line behind
		.replace(/\n\n(\t<section>)/, '\n$1')

	const file = join(HOME, fileOf(language.code))
	if (check) {
		if (!existsSync(file) || readFileSync(file, 'utf8') !== page) {
			console.error(`${fileOf(language.code)} is stale: run \`npm run privacy -w home\``)
			stale++
		}
	} else {
		mkdirSync(dirname(file), { recursive: true })
		writeFileSync(file, page)
		console.log(`wrote ${fileOf(language.code)}`)
	}
}
// vercel.json: the fallback redirects, made from the same languages; any
// other redirect there (www to the apex) is kept as it is, ahead of them
const vercelFile = join(HOME, 'vercel.json')
const vercel = JSON.parse(readFileSync(vercelFile, 'utf8'))
const ours = r => r.source === '/privacy' || r.source.startsWith('/privacy/')
const redirects = [...(vercel.redirects ?? []).filter(r => !ours(r)), ...vercelRedirects(languages)]
if (check) {
	if (JSON.stringify(vercel.redirects) !== JSON.stringify(redirects)) {
		console.error(`vercel.json's redirects to ${DEFAULT_PAGE} are stale: run \`npm run privacy -w home\``)
		stale++
	}
} else {
	writeFileSync(vercelFile, JSON.stringify({ ...vercel, redirects }, null, 2) + '\n')
	console.log(`wrote vercel.json's redirects to ${DEFAULT_PAGE}`)
}

if (stale) process.exit(1)
if (check) console.log(`privacy notice current (${languages.length} languages)`)
