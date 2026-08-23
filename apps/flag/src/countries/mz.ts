import { Country } from './Country'

export const mz: Country = {
	code: 'mz',
	name: {
		en: 'Mozambique',
		ar: 'موزمبيق',
		de: 'Mosambik',
		sv: 'Moçambique',
		da: 'Mozambique',
		sq: 'Mozambiku',
		pt: 'Moçambique',
		tr: 'Mozambik',
		fa: 'موزامبیک',
		uk: 'Мозамбік',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇲🇿',
}
