import { Country } from './Country'

export const sm: Country = {
	code: 'sm',
	name: {
		en: 'San Marino',
		ar: 'سان مارينو',
		de: 'San Marino',
		sv: 'San Marino',
		da: 'San Marino',
		sq: 'San Marino',
		pt: 'San Marino',
		tr: 'San Marino',
		fa: 'سان مارینو',
		uk: 'Сан-Марино',
		// display-only — these three interface languages have no recordings
		el: 'Άγιος Μαρίνος',
		th: 'ซานมารีโน',
		zh: '圣马力诺',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇸🇲',
}
