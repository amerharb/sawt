import { Country } from './Country'

export const li: Country = {
	code: 'li',
	name: {
		en: 'Liechtenstein',
		ar: 'ليختنشتاين',
		de: 'Liechtenstein',
		sv: 'Liechtenstein',
		da: 'Liechtenstein',
		sq: 'Lihtenshtajni',
		pt: 'Liechtenstein',
		tr: 'Lihtenştayn',
		fa: 'لیختن‌اشتاین',
		uk: 'Ліхтенштейн',
		// display-only — these three interface languages have no recordings
		el: 'Λιχτενστάιν',
		th: 'ลิกเตนสไตน์',
		zh: '列支敦士登',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇱🇮',
}
