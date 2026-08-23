import { Country } from './Country'

export const zm: Country = {
	code: 'zm',
	name: {
		en: 'Zambia',
		ar: 'زامبيا',
		de: 'Sambia',
		sv: 'Zambia',
		da: 'Zambia',
		sq: 'Zambia',
		pt: 'Zâmbia',
		tr: 'Zambiya',
		fa: 'زامبیا',
		uk: 'Замбія',
		// display-only — these three interface languages have no recordings
		el: 'Ζάμπια',
		th: 'แซมเบีย',
		zh: '赞比亚',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇿🇲',
}
