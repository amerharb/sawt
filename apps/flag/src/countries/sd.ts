import { Country } from './Country'

export const sd: Country = {
	code: 'sd',
	name: {
		en: 'Sudan',
		ar: 'السودان',
		de: 'Sudan',
		sv: 'Sudan',
		da: 'Sudan',
		sq: 'Sudani',
		pt: 'Sudão',
		tr: 'Sudan',
		fa: 'سودان',
		uk: 'Судан',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇸🇩',
}
