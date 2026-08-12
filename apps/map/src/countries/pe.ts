import { Country } from './Country'

export const pe: Country = {
	code: 'pe',
	name: {
		en: 'Peru',
		ar: 'بيرو',
		de: 'Peru',
		sv: 'Peru',
		da: 'Peru',
		sq: 'Peruja',
		pt: 'Peru',
		tr: 'Peru',
		fa: 'پرو',
		uk: 'Перу',
		// display-only — these three interface languages have no recordings
		el: 'Περού',
		th: 'เปรู',
		zh: '秘鲁',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇵🇪',
}
