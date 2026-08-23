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
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇭🇳',
}
