import { Country } from './Country'

export const bz: Country = {
	code: 'bz',
	name: {
		en: 'Belize',
		ar: 'بليز',
		de: 'Belize',
		sv: 'Belize',
		da: 'Belize',
		sq: 'Belize',
		pt: 'Belize',
		tr: 'Belize',
		fa: 'بلیز',
		uk: 'Беліз',
		// display-only — these three interface languages have no recordings
		el: 'Μπελίζ',
		th: 'เบลีซ',
		zh: '伯利兹',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇧🇿',
}
