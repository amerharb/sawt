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
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇮🇳',
}
