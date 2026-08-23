import { Country } from './Country'

export const ke: Country = {
	code: 'ke',
	name: {
		en: 'Kenya',
		ar: 'كينيا',
		de: 'Kenia',
		sv: 'Kenya',
		da: 'Kenya',
		sq: 'Kenia',
		pt: 'Quénia',
		tr: 'Kenya',
		fa: 'کنیا',
		uk: 'Кенія',
		// display-only — these three interface languages have no recordings
		el: 'Κένυα',
		th: 'เคนยา',
		zh: '肯尼亚',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇰🇪',
}
