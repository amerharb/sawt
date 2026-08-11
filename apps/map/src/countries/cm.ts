import { Country } from './Country'

export const cm: Country = {
	code: 'cm',
	name: {
		en: 'Cameroon',
		ar: 'الكاميرون',
		de: 'Kamerun',
		sv: 'Kamerun',
		da: 'Cameroun',
		sq: 'Kameruni',
		pt: 'Camarões',
		tr: 'Kamerun',
		fa: 'کامرون',
		uk: 'Камерун',
		// display-only — these three interface languages have no recordings
		el: 'Καμερούν',
		th: 'แคเมอรูน',
		zh: '喀麦隆',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇨🇲',
}
