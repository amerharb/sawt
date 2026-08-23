import { Country } from './Country'

export const me: Country = {
	code: 'me',
	name: {
		en: 'Montenegro',
		ar: 'الجبل الأسود',
		de: 'Montenegro',
		sv: 'Montenegro',
		da: 'Montenegro',
		sq: 'Mali i Zi',
		pt: 'Montenegro',
		tr: 'Karadağ',
		fa: 'مونته‌نگرو',
		uk: 'Чорногорія',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇲🇪',
}
