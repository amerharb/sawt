import { Country } from './Country'

export const to: Country = {
	code: 'to',
	name: {
		en: 'Tonga',
		ar: 'تونغا',
		de: 'Tonga',
		sv: 'Tonga',
		da: 'Tonga',
		sq: 'Tonga',
		pt: 'Tonga',
		tr: 'Tonga',
		fa: 'تونگا',
		uk: 'Тонга',
		// display-only — these three interface languages have no recordings
		el: 'Τόνγκα',
		th: 'ตองงา',
		zh: '汤加',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇹🇴',
}
