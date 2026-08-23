import { Country } from './Country'

export const hn: Country = {
	code: 'hn',
	name: {
		en: 'Honduras',
		ar: 'هندوراس',
		de: 'Honduras',
		sv: 'Honduras',
		da: 'Honduras',
		sq: 'Hondurasi',
		pt: 'Honduras',
		tr: 'Honduras',
		fa: 'هندوراس',
		uk: 'Гондурас',
		// display-only — these three interface languages have no recordings
		el: 'Ονδούρα',
		th: 'ฮอนดูรัส',
		zh: '洪都拉斯',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇭🇳',
}
