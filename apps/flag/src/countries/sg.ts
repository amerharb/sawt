import { Country } from './Country'

export const sg: Country = {
	code: 'sg',
	name: {
		en: 'Singapore',
		ar: 'سنغافورة',
		de: 'Singapur',
		sv: 'Singapore',
		da: 'Singapore',
		sq: 'Singapori',
		pt: 'Singapura',
		tr: 'Singapur',
		fa: 'سنگاپور',
		uk: 'Сінгапур',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇸🇬',
}
