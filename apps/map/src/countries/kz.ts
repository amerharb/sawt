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
		// display-only — these three interface languages have no recordings
		el: 'Καζακστάν',
		th: 'คาซัคสถาน',
		zh: '哈萨克斯坦',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇰🇿',
}
