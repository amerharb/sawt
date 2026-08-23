import { Country } from './Country'

export const la: Country = {
	code: 'la',
	name: {
		en: 'Laos',
		ar: 'لاوس',
		de: 'Laos',
		sv: 'Laos',
		da: 'Laos',
		sq: 'Laosi',
		pt: 'Laos',
		tr: 'Laos',
		fa: 'لائوس',
		uk: 'Лаос',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇱🇦',
}
