import { Country } from './Country'

export const kw: Country = {
	code: 'kw',
	name: {
		en: 'Kuwait',
		ar: 'الكويت',
		de: 'Kuwait',
		sv: 'Kuwait',
		da: 'Kuwait',
		sq: 'Kuvajti',
		pt: 'Kuwait',
		tr: 'Kuveyt',
		fa: 'کویت',
		uk: 'Кувейт',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇰🇼',
}
