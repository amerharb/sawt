import { Country } from './Country'

export const ru: Country = {
	code: 'ru',
	name: {
		en: 'Russia',
		ar: 'روسيا',
		de: 'Russland',
		sv: 'Ryssland',
		da: 'Rusland',
		sq: 'Rusia',
		pt: 'Rússia',
		tr: 'Rusya',
		fa: 'روسیه',
		uk: 'Росія',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇷🇺',
}
