import { Country } from './Country'

export const km: Country = {
	code: 'km',
	name: {
		en: 'Comoros',
		ar: 'جزر القمر',
		de: 'Komoren',
		sv: 'Komorerna',
		da: 'Comorerne',
		sq: 'Komoret',
		pt: 'Comores',
		tr: 'Komorlar',
		fa: 'کومور',
		uk: 'Комори',
		// display-only — these three interface languages have no recordings
		el: 'Κομόρες',
		th: 'คอโมโรส',
		zh: '科摩罗',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇰🇲',
	// beta on the map only: the Comoros are 3 islands, the biggest 0.6 x 1.6 units —
	// smaller than Luxembourg, the smallest shape that still reads as a
	// country, so there is nothing to click. Stays live in Flag.
	beta: true,
}
