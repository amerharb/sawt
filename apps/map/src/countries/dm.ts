import { Country } from './Country'

export const dm: Country = {
	code: 'dm',
	name: {
		en: 'Dominica',
		ar: 'دومينيكا',
		de: 'Dominica',
		sv: 'Dominica',
		da: 'Dominica',
		sq: 'Dominika',
		pt: 'Dominica',
		tr: 'Dominika',
		fa: 'دومینیکا',
		uk: 'Домініка',
		// display-only — these three interface languages have no recordings
		el: 'Ντομίνικα',
		th: 'ดอมินีกา',
		zh: '多米尼克',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇩🇲',
}
