import { Country } from './Country'

export const tl: Country = {
	code: 'tl',
	name: {
		en: 'East Timor',
		ar: 'تيمور الشرقية',
		de: 'Osttimor',
		sv: 'Östtimor',
		da: 'Østtimor',
		sq: 'Timori Lindor',
		pt: 'Timor-Leste',
		tr: 'Doğu Timor',
		fa: 'تیمور شرقی',
		uk: 'Східний Тимор',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇹🇱',
}
