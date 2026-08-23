import { Country } from './Country'

export const qa: Country = {
	code: 'qa',
	name: {
		en: 'Qatar',
		ar: 'قطر',
		de: 'Katar',
		sv: 'Qatar',
		da: 'Qatar',
		sq: 'Katari',
		pt: 'Catar',
		tr: 'Katar',
		fa: 'قطر',
		uk: 'Катар',
		// display-only — these three interface languages have no recordings
		el: 'Κατάρ',
		th: 'กาตาร์',
		zh: '卡塔尔',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇶🇦',
}
