import { Country } from './Country'

export const ng: Country = {
	code: 'ng',
	name: {
		en: 'Nigeria',
		ar: 'نيجيريا',
		de: 'Nigeria',
		sv: 'Nigeria',
		da: 'Nigeria',
		sq: 'Nigeria',
		pt: 'Nigéria',
		tr: 'Nijerya',
		fa: 'نیجریه',
		uk: 'Нігерія',
		// display-only — these three interface languages have no recordings
		el: 'Νιγηρία',
		th: 'ไนจีเรีย',
		zh: '尼日利亚',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇳🇬',
}
