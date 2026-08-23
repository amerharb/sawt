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
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇱🇮',
}
