import { Country } from './Country'

export const lv: Country = {
	code: 'lv',
	name: {
		en: 'Latvia',
		ar: 'لاتفيا',
		de: 'Lettland',
		sv: 'Lettland',
		da: 'Letland',
		sq: 'Letonia',
		pt: 'Letónia',
		tr: 'Letonya',
		fa: 'لتونی',
		uk: 'Латвія',
		// display-only — these three interface languages have no recordings
		el: 'Λετονία',
		th: 'ลัตเวีย',
		zh: '拉脱维亚',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇱🇻',
}
