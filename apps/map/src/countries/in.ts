import { Country } from './Country'

// `in` is a reserved word, so the export is `ind` — the same dodge gb-sct uses
export const ind: Country = {
	code: 'in',
	name: {
		en: 'India',
		ar: 'الهند',
		de: 'Indien',
		sv: 'Indien',
		da: 'Indien',
		sq: 'India',
		pt: 'Índia',
		tr: 'Hindistan',
		fa: 'هند',
		uk: 'Індія',
	},
	// the three interface languages the sound set lacks — hover names only.
	label: {
		el: 'Ινδία',
		th: 'อินเดีย',
		zh: '印度',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇮🇳',
}
