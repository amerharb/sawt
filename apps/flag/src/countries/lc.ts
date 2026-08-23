import { Country } from './Country'

export const lc: Country = {
	code: 'lc',
	name: {
		en: 'Saint Lucia',
		ar: 'سانت لوسيا',
		de: 'St. Lucia',
		sv: 'Saint Lucia',
		da: 'Saint Lucia',
		sq: 'Shën Lucia',
		pt: 'Santa Lúcia',
		tr: 'Saint Lucia',
		fa: 'سنت لوسیا',
		uk: 'Сент-Люсія',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇱🇨',
}
