import { Country } from './Country'

export const zw: Country = {
	code: 'zw',
	name: {
		en: 'Zimbabwe',
		ar: 'زيمبابوي',
		de: 'Simbabwe',
		sv: 'Zimbabwe',
		da: 'Zimbabwe',
		sq: 'Zimbabve',
		pt: 'Zimbábue',
		tr: 'Zimbabve',
		fa: 'زیمبابوه',
		uk: 'Зімбабве',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇿🇼',
}
