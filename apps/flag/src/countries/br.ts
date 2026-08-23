import { Country } from './Country'

export const br: Country = {
	code: 'br',
	name: {
		en: 'Brazil',
		ar: 'البرازيل',
		de: 'Brasilien',
		sv: 'Brasilien',
		da: 'Brasilien',
		sq: 'Brazili',
		pt: 'Brasil',
		tr: 'Brezilya',
		fa: 'برزیل',
		uk: 'Бразилія',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇧🇷',
}
