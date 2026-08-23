import { Country } from './Country'

export const kh: Country = {
	code: 'kh',
	name: {
		en: 'Cambodia',
		ar: 'كمبوديا',
		de: 'Kambodscha',
		sv: 'Kambodja',
		da: 'Cambodja',
		sq: 'Kamboxhia',
		pt: 'Camboja',
		tr: 'Kamboçya',
		fa: 'کامبوج',
		uk: 'Камбоджа',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇰🇭',
}
