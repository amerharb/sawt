import { Country } from './Country'

export const vn: Country = {
	code: 'vn',
	name: {
		en: 'Vietnam',
		ar: 'فيتنام',
		de: 'Vietnam',
		sv: 'Vietnam',
		da: 'Vietnam',
		sq: 'Vietnami',
		pt: 'Vietname',
		tr: 'Vietnam',
		fa: 'ویتنام',
		uk: 'В\'єтнам',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇻🇳',
}
