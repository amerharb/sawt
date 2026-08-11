import { Country } from './Country'

export const ml: Country = {
	code: 'ml',
	name: {
		en: 'Mali',
		ar: 'مالي',
		de: 'Mali',
		sv: 'Mali',
		da: 'Mali',
		sq: 'Mali',
		pt: 'Mali',
		tr: 'Mali',
		fa: 'مالی',
		uk: 'Малі',
		// display-only — these three interface languages have no recordings
		el: 'Μάλι',
		th: 'มาลี',
		zh: '马里',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇲🇱',
}
