import { Country } from './Country'

export const cu: Country = {
	code: 'cu',
	name: {
		en: 'Cuba',
		ar: 'كوبا',
		de: 'Kuba',
		sv: 'Kuba',
		da: 'Cuba',
		sq: 'Kuba',
		pt: 'Cuba',
		tr: 'Küba',
		fa: 'کوبا',
		uk: 'Куба',
		// display-only — these three interface languages have no recordings
		el: 'Κούβα',
		th: 'คิวบา',
		zh: '古巴',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇨🇺',
}
