import { Country } from './Country'

export const km: Country = {
	code: 'km',
	name: {
		en: 'Comoros',
		ar: 'جزر القمر',
		de: 'Komoren',
		sv: 'Komorerna',
		da: 'Comorerne',
		sq: 'Komoret',
		pt: 'Comores',
		tr: 'Komorlar',
		fa: 'کومور',
		uk: 'Комори',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇰🇲',
}
