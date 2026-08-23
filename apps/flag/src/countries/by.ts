import { Country } from './Country'

export const by: Country = {
	code: 'by',
	name: {
		en: 'Belarus',
		ar: 'بيلاروسيا',
		de: 'Belarus',
		sv: 'Belarus',
		da: 'Belarus',
		sq: 'Bjellorusia',
		pt: 'Bielorrússia',
		tr: 'Belarus',
		fa: 'بلاروس',
		uk: 'Білорусь',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇧🇾',
}
