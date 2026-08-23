import { Country } from './Country'

export const bj: Country = {
	code: 'bj',
	name: {
		en: 'Benin',
		ar: 'بنين',
		de: 'Benin',
		sv: 'Benin',
		da: 'Benin',
		sq: 'Benini',
		pt: 'Benim',
		tr: 'Benin',
		fa: 'بنین',
		uk: 'Бенін',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇧🇯',
}
