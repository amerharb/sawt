import { Country } from './Country'

export const gw: Country = {
	code: 'gw',
	name: {
		en: 'Guinea-Bissau',
		ar: 'غينيا بيساو',
		de: 'Guinea-Bissau',
		sv: 'Guinea-Bissau',
		da: 'Guinea-Bissau',
		sq: 'Guinea-Bisau',
		pt: 'Guiné-Bissau',
		tr: 'Gine-Bissau',
		fa: 'گینه بیسائو',
		uk: 'Гвінея-Бісау',
		// display-only — these three interface languages have no recordings
		el: 'Γουινέα-Μπισάου',
		th: 'กินี-บิสเซา',
		zh: '几内亚比绍',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇬🇼',
}
