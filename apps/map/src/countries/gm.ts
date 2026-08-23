import { Country } from './Country'

export const gm: Country = {
	code: 'gm',
	name: {
		en: 'Gambia',
		ar: 'غامبيا',
		de: 'Gambia',
		sv: 'Gambia',
		da: 'Gambia',
		sq: 'Gambia',
		pt: 'Gâmbia',
		tr: 'Gambiya',
		fa: 'گامبیا',
		uk: 'Гамбія',
		// display-only — these three interface languages have no recordings
		el: 'Γκάμπια',
		th: 'แกมเบีย',
		zh: '冈比亚',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇬🇲',
}
