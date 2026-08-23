import { Country } from './Country'

export const ly: Country = {
	code: 'ly',
	name: {
		en: 'Libya',
		ar: 'ليبيا',
		de: 'Libyen',
		sv: 'Libyen',
		da: 'Libyen',
		sq: 'Libia',
		pt: 'Líbia',
		tr: 'Libya',
		fa: 'لیبی',
		uk: 'Лівія',
		// display-only — these three interface languages have no recordings
		el: 'Λιβύη',
		th: 'ลิเบีย',
		zh: '利比亚',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇱🇾',
}
