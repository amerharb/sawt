import { Country } from './Country'

export const lt: Country = {
	code: 'lt',
	name: {
		en: 'Lithuania',
		ar: 'ليتوانيا',
		de: 'Litauen',
		sv: 'Litauen',
		da: 'Litauen',
		sq: 'Lituania',
		pt: 'Lituânia',
		tr: 'Litvanya',
		fa: 'لیتوانی',
		uk: 'Литва',
		// display-only — these three interface languages have no recordings
		el: 'Λιθουανία',
		th: 'ลิทัวเนีย',
		zh: '立陶宛',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇱🇹',
}
