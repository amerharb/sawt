import { Country } from './Country'

export const bb: Country = {
	code: 'bb',
	name: {
		en: 'Barbados',
		ar: 'بربادوس',
		de: 'Barbados',
		sv: 'Barbados',
		da: 'Barbados',
		sq: 'Barbadosi',
		pt: 'Barbados',
		tr: 'Barbados',
		fa: 'باربادوس',
		uk: 'Барбадос',
		// display-only — these three interface languages have no recordings
		el: 'Μπαρμπάντος',
		th: 'บาร์เบโดส',
		zh: '巴巴多斯',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇧🇧',
}
