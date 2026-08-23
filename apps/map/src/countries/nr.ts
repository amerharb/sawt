import { Country } from './Country'

export const nr: Country = {
	code: 'nr',
	name: {
		en: 'Nauru',
		ar: 'ناورو',
		de: 'Nauru',
		sv: 'Nauru',
		da: 'Nauru',
		sq: 'Nauru',
		pt: 'Nauru',
		tr: 'Nauru',
		fa: 'نائورو',
		uk: 'Науру',
		// display-only — these three interface languages have no recordings
		el: 'Ναουρού',
		th: 'นาอูรู',
		zh: '瑙鲁',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇳🇷',
}
