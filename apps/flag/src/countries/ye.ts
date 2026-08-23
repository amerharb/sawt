import { Country } from './Country'

export const ye: Country = {
	code: 'ye',
	name: {
		en: 'Yemen',
		ar: 'اليمن',
		de: 'Jemen',
		sv: 'Jemen',
		da: 'Yemen',
		sq: 'Jemeni',
		pt: 'Iémen',
		tr: 'Yemen',
		fa: 'یمن',
		uk: 'Ємен',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇾🇪',
}
