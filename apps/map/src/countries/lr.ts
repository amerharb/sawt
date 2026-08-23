import { Country } from './Country'

export const lr: Country = {
	code: 'lr',
	name: {
		en: 'Liberia',
		ar: 'ليبيريا',
		de: 'Liberia',
		sv: 'Liberia',
		da: 'Liberia',
		sq: 'Liberia',
		pt: 'Libéria',
		tr: 'Liberya',
		fa: 'لیبریا',
		uk: 'Ліберія',
		// display-only — these three interface languages have no recordings
		el: 'Λιβερία',
		th: 'ไลบีเรีย',
		zh: '利比里亚',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇱🇷',
}
