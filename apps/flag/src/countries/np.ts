import { Country } from './Country'

export const np: Country = {
	code: 'np',
	name: {
		en: 'Nepal',
		ar: 'نيبال',
		de: 'Nepal',
		sv: 'Nepal',
		da: 'Nepal',
		sq: 'Nepali',
		pt: 'Nepal',
		tr: 'Nepal',
		fa: 'نپال',
		uk: 'Непал',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇳🇵',
}
