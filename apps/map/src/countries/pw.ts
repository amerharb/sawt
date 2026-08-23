import { Country } from './Country'

export const pw: Country = {
	code: 'pw',
	name: {
		en: 'Palau',
		ar: 'بالاو',
		de: 'Palau',
		sv: 'Palau',
		da: 'Palau',
		sq: 'Palau',
		pt: 'Palau',
		tr: 'Palau',
		fa: 'پالائو',
		uk: 'Палау',
		// display-only — these three interface languages have no recordings
		el: 'Παλάου',
		th: 'ปาเลา',
		zh: '帕劳',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇵🇼',
}
