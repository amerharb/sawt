import { Country } from './Country'

export const kz: Country = {
	code: 'kz',
	name: {
		en: 'Kazakhstan',
		ar: 'كازاخستان',
		de: 'Kasachstan',
		sv: 'Kazakstan',
		da: 'Kasakhstan',
		sq: 'Kazakistani',
		pt: 'Cazaquistão',
		tr: 'Kazakistan',
		fa: 'قزاقستان',
		uk: 'Казахстан',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇰🇿',
}
