import { Country } from './Country'

export const gm: Country = {
	code: 'gm',
	name: {
		en: 'Gambia',
		ar: 'غامبيا',
		de: 'Gambia',
		sv: 'Gambia',
		da: 'Gambia',
		sq: 'Gambia',
		pt: 'Gâmbia',
		tr: 'Gambiya',
		fa: 'گامبیا',
		uk: 'Гамбія',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇬🇲',
}
