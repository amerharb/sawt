import { Country } from './Country'

export const tv: Country = {
	code: 'tv',
	name: {
		en: 'Tuvalu',
		ar: 'توفالو',
		de: 'Tuvalu',
		sv: 'Tuvalu',
		da: 'Tuvalu',
		sq: 'Tuvalu',
		pt: 'Tuvalu',
		tr: 'Tuvalu',
		fa: 'تووالو',
		uk: 'Тувалу',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇹🇻',
}
