import { Country } from './Country'

export const co: Country = {
	code: 'co',
	name: {
		en: 'Colombia',
		ar: 'كولومبيا',
		de: 'Kolumbien',
		sv: 'Colombia',
		da: 'Colombia',
		sq: 'Kolumbia',
		pt: 'Colômbia',
		tr: 'Kolombiya',
		fa: 'کلمبیا',
		uk: 'Колумбія',
		// display-only — these three interface languages have no recordings
		el: 'Κολομβία',
		th: 'โคลอมเบีย',
		zh: '哥伦比亚',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇨🇴',
}
