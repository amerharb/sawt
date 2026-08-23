import { Country } from './Country'

export const cr: Country = {
	code: 'cr',
	name: {
		en: 'Costa Rica',
		ar: 'كوستاريكا',
		de: 'Costa Rica',
		sv: 'Costa Rica',
		da: 'Costa Rica',
		sq: 'Kosta Rika',
		pt: 'Costa Rica',
		tr: 'Kosta Rika',
		fa: 'کاستاریکا',
		uk: 'Коста-Рика',
		// display-only — these three interface languages have no recordings
		el: 'Κόστα Ρίκα',
		th: 'คอสตาริกา',
		zh: '哥斯达黎加',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇨🇷',
}
