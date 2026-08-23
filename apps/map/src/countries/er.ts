import { Country } from './Country'

export const er: Country = {
	code: 'er',
	name: {
		en: 'Eritrea',
		ar: 'إريتريا',
		de: 'Eritrea',
		sv: 'Eritrea',
		da: 'Eritrea',
		sq: 'Eritrea',
		pt: 'Eritreia',
		tr: 'Eritre',
		fa: 'اریتره',
		uk: 'Еритрея',
		// display-only — these three interface languages have no recordings
		el: 'Ερυθραία',
		th: 'เอริเทรีย',
		zh: '厄立特里亚',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇪🇷',
}
