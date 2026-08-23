import { Country } from './Country'

export const mu: Country = {
	code: 'mu',
	name: {
		en: 'Mauritius',
		ar: 'موريشيوس',
		de: 'Mauritius',
		sv: 'Mauritius',
		da: 'Mauritius',
		sq: 'Mauricius',
		pt: 'Maurícia',
		tr: 'Mauritius',
		fa: 'موریس',
		uk: 'Маврикій',
		// display-only — these three interface languages have no recordings
		el: 'Μαυρίκιος',
		th: 'มอริเชียส',
		zh: '毛里求斯',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇲🇺',
	// beta on the map only: Mauritius is one island, but only 1.4 x 1.6 units —
	// smaller than Luxembourg, the smallest shape that still reads as a
	// country, so there is nothing to click. Stays live in Flag.
	beta: true,
}
