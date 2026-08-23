import { Country } from './Country'

export const ga: Country = {
	code: 'ga',
	name: {
		en: 'Gabon',
		ar: 'الغابون',
		de: 'Gabun',
		sv: 'Gabon',
		da: 'Gabon',
		sq: 'Gaboni',
		pt: 'Gabão',
		tr: 'Gabon',
		fa: 'گابن',
		uk: 'Габон',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇬🇦',
}
