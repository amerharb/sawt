import { Country } from './Country'

export const tg: Country = {
	code: 'tg',
	name: {
		en: 'Togo',
		ar: 'توغو',
		de: 'Togo',
		sv: 'Togo',
		da: 'Togo',
		sq: 'Togo',
		pt: 'Togo',
		tr: 'Togo',
		fa: 'توگو',
		uk: 'Того',
		// display-only — these three interface languages have no recordings
		el: 'Τόγκο',
		th: 'โตโก',
		zh: '多哥',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇹🇬',
}
