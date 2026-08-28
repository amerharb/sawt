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
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇲🇺',
}
