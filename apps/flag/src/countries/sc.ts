import { Country } from './Country'

export const sc: Country = {
	code: 'sc',
	name: {
		en: 'Seychelles',
		ar: 'سيشل',
		de: 'Seychellen',
		sv: 'Seychellerna',
		da: 'Seychellerne',
		sq: 'Sejshellet',
		pt: 'Seicheles',
		tr: 'Seyşeller',
		fa: 'سیشل',
		uk: 'Сейшельські Острови',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇸🇨',
}
