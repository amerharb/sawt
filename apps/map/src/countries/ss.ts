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
		// display-only — these three interface languages have no recordings
		el: 'Νότιο Σουδάν',
		th: 'เซาท์ซูดาน',
		zh: '南苏丹',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇸🇸',
}
