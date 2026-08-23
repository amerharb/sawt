import { Country } from './Country'

export const fm: Country = {
	code: 'fm',
	name: {
		en: 'Micronesia',
		ar: 'ميكرونيزيا',
		de: 'Mikronesien',
		sv: 'Mikronesien',
		da: 'Mikronesien',
		sq: 'Mikronezia',
		pt: 'Micronésia',
		tr: 'Mikronezya',
		fa: 'میکرونزی',
		uk: 'Мікронезія',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇫🇲',
}
