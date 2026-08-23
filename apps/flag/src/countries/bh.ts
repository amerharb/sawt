import { Country } from './Country'

export const bh: Country = {
	code: 'bh',
	name: {
		en: 'Bahrain',
		ar: 'البحرين',
		de: 'Bahrain',
		sv: 'Bahrain',
		da: 'Bahrain',
		sq: 'Bahreini',
		pt: 'Barém',
		tr: 'Bahreyn',
		fa: 'بحرین',
		uk: 'Бахрейн',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇧🇭',
}
