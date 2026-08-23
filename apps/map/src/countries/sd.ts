import { Country } from './Country'

export const sd: Country = {
	code: 'sd',
	name: {
		en: 'Sudan',
		ar: 'السودان',
		de: 'Sudan',
		sv: 'Sudan',
		da: 'Sudan',
		sq: 'Sudani',
		pt: 'Sudão',
		tr: 'Sudan',
		fa: 'سودان',
		uk: 'Судан',
		// display-only — these three interface languages have no recordings
		el: 'Σουδάν',
		th: 'ซูดาน',
		zh: '苏丹',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇸🇩',
}
