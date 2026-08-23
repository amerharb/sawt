import { Country } from './Country'

export const mk: Country = {
	code: 'mk',
	name: {
		en: 'North Macedonia',
		ar: 'مقدونيا الشمالية',
		de: 'Nordmazedonien',
		sv: 'Nordmakedonien',
		da: 'Nordmakedonien',
		sq: 'Maqedonia e Veriut',
		pt: 'Macedónia do Norte',
		tr: 'Kuzey Makedonya',
		fa: 'مقدونیه شمالی',
		uk: 'Північна Македонія',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇲🇰',
}
