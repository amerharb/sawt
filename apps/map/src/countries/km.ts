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
		// display-only — these three interface languages have no recordings
		el: 'Κομόρες',
		th: 'คอโมโรส',
		zh: '科摩罗',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇰🇲',
}
