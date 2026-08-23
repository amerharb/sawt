import { Country } from './Country'

export const fj: Country = {
	code: 'fj',
	name: {
		en: 'Fiji',
		ar: 'فيجي',
		de: 'Fidschi',
		sv: 'Fiji',
		da: 'Fiji',
		sq: 'Fixhi',
		pt: 'Fiji',
		tr: 'Fiji',
		fa: 'فیجی',
		uk: 'Фіджі',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇫🇯',
}
