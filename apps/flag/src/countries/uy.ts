import { Country } from './Country'

export const uy: Country = {
	code: 'uy',
	name: {
		en: 'Uruguay',
		ar: 'الأوروغواي',
		de: 'Uruguay',
		sv: 'Uruguay',
		da: 'Uruguay',
		sq: 'Uruguai',
		pt: 'Uruguai',
		tr: 'Uruguay',
		fa: 'اروگوئه',
		uk: 'Уругвай',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇺🇾',
}
