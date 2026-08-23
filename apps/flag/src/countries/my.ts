import { Country } from './Country'

export const my: Country = {
	code: 'my',
	name: {
		en: 'Malaysia',
		ar: 'ماليزيا',
		de: 'Malaysia',
		sv: 'Malaysia',
		da: 'Malaysia',
		sq: 'Malajzia',
		pt: 'Malásia',
		tr: 'Malezya',
		fa: 'مالزی',
		uk: 'Малайзія',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇲🇾',
}
