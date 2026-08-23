import { Country } from './Country'

export const mv: Country = {
	code: 'mv',
	name: {
		en: 'Maldives',
		ar: 'المالديف',
		de: 'Malediven',
		sv: 'Maldiverna',
		da: 'Maldiverne',
		sq: 'Maldivet',
		pt: 'Maldivas',
		tr: 'Maldivler',
		fa: 'مالدیو',
		uk: 'Мальдіви',
		// display-only — these three interface languages have no recordings
		el: 'Μαλδίβες',
		th: 'มัลดีฟส์',
		zh: '马尔代夫',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇲🇻',
}
