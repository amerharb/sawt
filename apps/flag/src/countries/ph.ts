import { Country } from './Country'

export const ph: Country = {
	code: 'ph',
	name: {
		en: 'Philippines',
		ar: 'الفلبين',
		de: 'Philippinen',
		sv: 'Filippinerna',
		da: 'Filippinerne',
		sq: 'Filipinet',
		pt: 'Filipinas',
		tr: 'Filipinler',
		fa: 'فیلیپین',
		uk: 'Філіппіни',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇵🇭',
}
