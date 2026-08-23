import { Country } from './Country'

export const md: Country = {
	code: 'md',
	name: {
		en: 'Moldova',
		ar: 'مولدوفا',
		de: 'Moldau',
		sv: 'Moldavien',
		da: 'Moldova',
		sq: 'Moldavia',
		pt: 'Moldávia',
		tr: 'Moldova',
		fa: 'مولداوی',
		uk: 'Молдова',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇲🇩',
}
