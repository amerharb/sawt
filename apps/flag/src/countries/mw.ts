import { Country } from './Country'

export const mw: Country = {
	code: 'mw',
	name: {
		en: 'Malawi',
		ar: 'مالاوي',
		de: 'Malawi',
		sv: 'Malawi',
		da: 'Malawi',
		sq: 'Malavia',
		pt: 'Malawi',
		tr: 'Malavi',
		fa: 'مالاوی',
		uk: 'Малаві',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇲🇼',
}
