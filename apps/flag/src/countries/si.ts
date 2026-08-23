import { Country } from './Country'

export const si: Country = {
	code: 'si',
	name: {
		en: 'Slovenia',
		ar: 'سلوفينيا',
		de: 'Slowenien',
		sv: 'Slovenien',
		da: 'Slovenien',
		sq: 'Sllovenia',
		pt: 'Eslovénia',
		tr: 'Slovenya',
		fa: 'اسلوونی',
		uk: 'Словенія',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇸🇮',
}
