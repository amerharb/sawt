import { Country } from './Country'

export const la: Country = {
	code: 'la',
	name: {
		en: 'Laos',
		ar: 'لاوس',
		de: 'Laos',
		sv: 'Laos',
		da: 'Laos',
		sq: 'Laosi',
		pt: 'Laos',
		tr: 'Laos',
		fa: 'لائوس',
		uk: 'Лаос',
		// display-only — these three interface languages have no recordings
		el: 'Λάος',
		th: 'ลาว',
		zh: '老挝',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇱🇦',
}
