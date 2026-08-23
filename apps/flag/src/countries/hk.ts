import { Country } from './Country'

export const hk: Country = {
	code: 'hk',
	name: {
		en: 'Hong Kong',
		ar: 'هونغ كونغ',
		de: 'Hongkong',
		sv: 'Hongkong',
		da: 'Hongkong',
		sq: 'Hong Kongu',
		pt: 'Hong Kong',
		tr: 'Hong Kong',
		fa: 'هنگ‌کنگ',
		uk: 'Гонконг',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this entry steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	// a special administrative region of China, not a sovereign state
	flag: '🇭🇰',
}
