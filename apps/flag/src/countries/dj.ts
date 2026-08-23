import { Country } from './Country'

export const dj: Country = {
	code: 'dj',
	name: {
		en: 'Djibouti',
		ar: 'جيبوتي',
		de: 'Dschibuti',
		sv: 'Djibouti',
		da: 'Djibouti',
		sq: 'Xhibuti',
		pt: 'Djibuti',
		tr: 'Cibuti',
		fa: 'جیبوتی',
		uk: 'Джибуті',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇩🇯',
}
