import { Country } from './Country'

export const zm: Country = {
	code: 'zm',
	name: {
		en: 'Zambia',
		ar: 'زامبيا',
		de: 'Sambia',
		sv: 'Zambia',
		da: 'Zambia',
		sq: 'Zambia',
		pt: 'Zâmbia',
		tr: 'Zambiya',
		fa: 'زامبیا',
		uk: 'Замбія',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇿🇲',
}
