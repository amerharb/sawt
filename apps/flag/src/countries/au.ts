import { Country } from './Country'

export const au: Country = {
	code: 'au',
	name: {
		en: 'Australia',
		ar: 'أستراليا',
		de: 'Australien',
		sv: 'Australien',
		da: 'Australien',
		sq: 'Australia',
		pt: 'Austrália',
		tr: 'Avustralya',
		fa: 'استرالیا',
		uk: 'Австралія',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇦🇺',
}
