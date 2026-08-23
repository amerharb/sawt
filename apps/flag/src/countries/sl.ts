import { Country } from './Country'

export const sl: Country = {
	code: 'sl',
	name: {
		en: 'Sierra Leone',
		ar: 'سيراليون',
		de: 'Sierra Leone',
		sv: 'Sierra Leone',
		da: 'Sierra Leone',
		sq: 'Sierra Leone',
		pt: 'Serra Leoa',
		tr: 'Sierra Leone',
		fa: 'سیرالئون',
		uk: 'Сьєрра-Леоне',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇸🇱',
}
