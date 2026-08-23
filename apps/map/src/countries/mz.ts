import { Country } from './Country'

export const mz: Country = {
	code: 'mz',
	name: {
		en: 'Mozambique',
		ar: 'موزمبيق',
		de: 'Mosambik',
		sv: 'Moçambique',
		da: 'Mozambique',
		sq: 'Mozambiku',
		pt: 'Moçambique',
		tr: 'Mozambik',
		fa: 'موزامبیک',
		uk: 'Мозамбік',
		// display-only — these three interface languages have no recordings
		el: 'Μοζαμβίκη',
		th: 'โมซัมบิก',
		zh: '莫桑比克',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇲🇿',
}
