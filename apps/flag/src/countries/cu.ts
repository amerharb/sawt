import { Country } from './Country'

export const cu: Country = {
	code: 'cu',
	name: {
		en: 'Cuba',
		ar: 'كوبا',
		de: 'Kuba',
		sv: 'Kuba',
		da: 'Cuba',
		sq: 'Kuba',
		pt: 'Cuba',
		tr: 'Küba',
		fa: 'کوبا',
		uk: 'Куба',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇨🇺',
}
