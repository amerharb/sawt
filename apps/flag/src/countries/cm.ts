import { Country } from './Country'

export const cm: Country = {
	code: 'cm',
	name: {
		en: 'Cameroon',
		ar: 'الكاميرون',
		de: 'Kamerun',
		sv: 'Kamerun',
		da: 'Cameroun',
		sq: 'Kameruni',
		pt: 'Camarões',
		tr: 'Kamerun',
		fa: 'کامرون',
		uk: 'Камерун',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇨🇲',
}
