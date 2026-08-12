import { Country } from './Country'

export const my: Country = {
	code: 'my',
	name: {
		en: 'Malaysia',
		ar: 'ماليزيا',
		de: 'Malaysia',
		sv: 'Malaysia',
		da: 'Malaysia',
		sq: 'Malajzia',
		pt: 'Malásia',
		tr: 'Malezya',
		fa: 'مالزی',
		uk: 'Малайзія',
		// display-only — these three interface languages have no recordings
		el: 'Μαλαισία',
		th: 'มาเลเซีย',
		zh: '马来西亚',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇲🇾',
}
