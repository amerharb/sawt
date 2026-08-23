import { Country } from './Country'

export const bi: Country = {
	code: 'bi',
	name: {
		en: 'Burundi',
		ar: 'بوروندي',
		de: 'Burundi',
		sv: 'Burundi',
		da: 'Burundi',
		sq: 'Burundi',
		pt: 'Burundi',
		tr: 'Burundi',
		fa: 'بوروندی',
		uk: 'Бурунді',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇧🇮',
}
