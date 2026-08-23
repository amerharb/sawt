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
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇹🇴',
	// beta on the map only: Tonga is 3 island groups and the biggest of them is a sub-pixel sliver —
	// smaller than Luxembourg, the smallest shape that still reads as a
	// country, so there is nothing to click. Stays live in Flag.
	beta: true,
}
