import { Country } from './Country'

export const tm: Country = {
	code: 'tm',
	name: {
		en: 'Turkmenistan',
		ar: 'تركمانستان',
		de: 'Turkmenistan',
		sv: 'Turkmenistan',
		da: 'Turkmenistan',
		sq: 'Turkmenistani',
		pt: 'Turquemenistão',
		tr: 'Türkmenistan',
		fa: 'ترکمنستان',
		uk: 'Туркменістан',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇹🇲',
}
