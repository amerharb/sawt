import { Country } from './Country'

export const kp: Country = {
	code: 'kp',
	name: {
		en: 'North Korea',
		ar: 'كوريا الشمالية',
		de: 'Nordkorea',
		sv: 'Nordkorea',
		da: 'Nordkorea',
		sq: 'Koreja e Veriut',
		pt: 'Coreia do Norte',
		tr: 'Kuzey Kore',
		fa: 'کره شمالی',
		uk: 'Північна Корея',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇰🇵',
}
