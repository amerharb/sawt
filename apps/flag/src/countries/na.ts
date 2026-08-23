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
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇳🇦',
}
