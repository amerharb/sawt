import { Country } from './Country'

export const ee: Country = {
	code: 'ee',
	name: {
		en: 'Estonia',
		ar: 'إستونيا',
		de: 'Estland',
		sv: 'Estland',
		da: 'Estland',
		sq: 'Estonia',
		pt: 'Estónia',
		tr: 'Estonya',
		fa: 'استونی',
		uk: 'Естонія',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇪🇪',
}
