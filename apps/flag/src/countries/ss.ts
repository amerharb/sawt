import { Country } from './Country'

export const ss: Country = {
	code: 'ss',
	name: {
		en: 'South Sudan',
		ar: 'جنوب السودان',
		de: 'Südsudan',
		sv: 'Sydsudan',
		da: 'Sydsudan',
		sq: 'Sudani i Jugut',
		pt: 'Sudão do Sul',
		tr: 'Güney Sudan',
		fa: 'سودان جنوبی',
		uk: 'Південний Судан',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇸🇸',
}
