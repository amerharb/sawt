import { Country } from './Country'

export const tv: Country = {
	code: 'tv',
	name: {
		en: 'Tuvalu',
		ar: 'توفالو',
		de: 'Tuvalu',
		sv: 'Tuvalu',
		da: 'Tuvalu',
		sq: 'Tuvalu',
		pt: 'Tuvalu',
		tr: 'Tuvalu',
		fa: 'تووالو',
		uk: 'Тувалу',
		// display-only — these three interface languages have no recordings
		el: 'Τουβαλού',
		th: 'ตูวาลู',
		zh: '图瓦卢',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇹🇻',
}
