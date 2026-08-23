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
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇩🇲',
}
