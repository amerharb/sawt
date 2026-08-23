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
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇱🇹',
}
