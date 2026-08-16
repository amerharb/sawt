import { Country } from './Country'

export const mo: Country = {
	code: 'mo',
	name: {
		en: 'Macau',
		ar: 'ماكاو',
		de: 'Macau',
		sv: 'Macau',
		da: 'Macau',
		sq: 'Makao',
		pt: 'Macau',
		tr: 'Makao',
		fa: 'ماکائو',
		uk: 'Макао',
		// display-only — these three interface languages have no recordings
		el: 'Μακάο',
		th: 'มาเก๊า',
		zh: '澳门',
	},
	// recorded in English only so far — in any other hearing language this
	// entry steps aside instead of clicking silently
	sounds: ['en'],
	// a special administrative region of China, not a sovereign state.
	// Too small to see at world scale, so on the map it is a dot
	flag: '🇲🇴',
}
