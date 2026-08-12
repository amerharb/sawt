import { Country } from './Country'

export const np: Country = {
	code: 'np',
	name: {
		en: 'Nepal',
		ar: 'نيبال',
		de: 'Nepal',
		sv: 'Nepal',
		da: 'Nepal',
		sq: 'Nepali',
		pt: 'Nepal',
		tr: 'Nepal',
		fa: 'نپال',
		uk: 'Непал',
		// display-only — these three interface languages have no recordings
		el: 'Νεπάλ',
		th: 'เนปาล',
		zh: '尼泊尔',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇳🇵',
}
