import { Country } from './Country'

export const ie: Country = {
	code: 'ie',
	name: {
		en: 'Ireland',
		ar: 'أيرلندا',
		de: 'Irland',
		sv: 'Irland',
		da: 'Irland',
		sq: 'Irlanda',
		pt: 'Irlanda',
		tr: 'İrlanda',
		fa: 'ایرلند',
		uk: 'Ірландія',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇮🇪',
}
