import { Country } from './Country'

export const mm: Country = {
	code: 'mm',
	name: {
		en: 'Myanmar',
		ar: 'ميانمار',
		de: 'Myanmar',
		sv: 'Myanmar',
		da: 'Myanmar',
		sq: 'Mianmari',
		pt: 'Mianmar',
		tr: 'Myanmar',
		fa: 'میانمار',
		uk: 'М\'янма',
		// display-only — these three interface languages have no recordings
		el: 'Μιανμάρ',
		th: 'เมียนมา',
		zh: '缅甸',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇲🇲',
}
