import { Country } from './Country'

export const ws: Country = {
	code: 'ws',
	name: {
		en: 'Samoa',
		ar: 'ساموا',
		de: 'Samoa',
		sv: 'Samoa',
		da: 'Samoa',
		sq: 'Samoa',
		pt: 'Samoa',
		tr: 'Samoa',
		fa: 'ساموآ',
		uk: 'Самоа',
		// display-only — these three interface languages have no recordings
		el: 'Σαμόα',
		th: 'ซามัว',
		zh: '萨摩亚',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇼🇸',
	// beta on the map only: Samoa is 2 islands, the biggest 1.7 x 1.1 units —
	// smaller than Luxembourg, the smallest shape that still reads as a
	// country, so there is nothing to click. Stays live in Flag.
	beta: true,
}
