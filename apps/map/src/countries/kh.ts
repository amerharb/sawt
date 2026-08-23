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
		// display-only — these three interface languages have no recordings
		el: 'Καμπότζη',
		th: 'กัมพูชา',
		zh: '柬埔寨',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇰🇭',
}
