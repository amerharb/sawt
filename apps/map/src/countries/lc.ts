import { Country } from './Country'

export const lc: Country = {
	code: 'lc',
	name: {
		en: 'Saint Lucia',
		ar: 'سانت لوسيا',
		de: 'St. Lucia',
		sv: 'Saint Lucia',
		da: 'Saint Lucia',
		sq: 'Shën Lucia',
		pt: 'Santa Lúcia',
		tr: 'Saint Lucia',
		fa: 'سنت لوسیا',
		uk: 'Сент-Люсія',
		// display-only — these three interface languages have no recordings
		el: 'Αγία Λουκία',
		th: 'เซนต์ลูเชีย',
		zh: '圣卢西亚',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇱🇨',
}
