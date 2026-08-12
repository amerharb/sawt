import { Country } from './Country'

export const mw: Country = {
	code: 'mw',
	name: {
		en: 'Malawi',
		ar: 'مالاوي',
		de: 'Malawi',
		sv: 'Malawi',
		da: 'Malawi',
		sq: 'Malavia',
		pt: 'Malawi',
		tr: 'Malavi',
		fa: 'مالاوی',
		uk: 'Малаві',
		// display-only — these three interface languages have no recordings
		el: 'Μαλάουι',
		th: 'มาลาวี',
		zh: '马拉维',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇲🇼',
}
