import { Country } from './Country'

export const gl: Country = {
	code: 'gl',
	name: {
		en: 'Greenland',
		ar: 'غرينلاند',
		de: 'Grönland',
		sv: 'Grönland',
		da: 'Grønland',
		sq: 'Grenlanda',
		pt: 'Gronelândia',
		tr: 'Grönland',
		fa: 'گرینلند',
		uk: 'Гренландія',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇬🇱',
}
