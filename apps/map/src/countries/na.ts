import { Country } from './Country'

export const na: Country = {
	code: 'na',
	name: {
		en: 'Namibia',
		ar: 'ناميبيا',
		de: 'Namibia',
		sv: 'Namibia',
		da: 'Namibia',
		sq: 'Namibia',
		pt: 'Namíbia',
		tr: 'Namibya',
		fa: 'نامیبیا',
		uk: 'Намібія',
		// display-only — these three interface languages have no recordings
		el: 'Ναμίμπια',
		th: 'นามิเบีย',
		zh: '纳米比亚',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇳🇦',
}
