import { Country } from './Country'

export const cn: Country = {
	code: 'cn',
	name: {
		en: 'China',
		ar: 'الصين',
		de: 'China',
		sv: 'Kina',
		da: 'Kina',
		sq: 'Kina',
		pt: 'China',
		tr: 'Çin',
		fa: 'چین',
		uk: 'Китай',
		// display-only — these three interface languages have no recordings
		el: 'Κίνα',
		th: 'จีน',
		zh: '中国',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇨🇳',
}
