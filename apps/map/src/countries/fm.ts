import { Country } from './Country'

export const fm: Country = {
	code: 'fm',
	name: {
		en: 'Micronesia',
		ar: 'ميكرونيزيا',
		de: 'Mikronesien',
		sv: 'Mikronesien',
		da: 'Mikronesien',
		sq: 'Mikronezia',
		pt: 'Micronésia',
		tr: 'Mikronezya',
		fa: 'میکرونزی',
		uk: 'Мікронезія',
		// display-only — these three interface languages have no recordings
		el: 'Μικρονησία',
		th: 'ไมโครนีเซีย',
		zh: '密克罗尼西亚',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇫🇲',
	// beta on the map only: Micronesia is 5 island groups strung across the Pacific and the biggest
	// of them is a sub-pixel sliver —
	// smaller than Luxembourg, the smallest shape that still reads as a
	// country, so there is nothing to click. Stays live in Flag.
	beta: true,
}
