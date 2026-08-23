import { Country } from './Country'

export const gh: Country = {
	code: 'gh',
	name: {
		en: 'Ghana',
		ar: 'غانا',
		de: 'Ghana',
		sv: 'Ghana',
		da: 'Ghana',
		sq: 'Gana',
		pt: 'Gana',
		tr: 'Gana',
		fa: 'غنا',
		uk: 'Гана',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇬🇭',
}
