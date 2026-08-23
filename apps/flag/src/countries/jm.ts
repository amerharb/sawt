import { Country } from './Country'

export const jm: Country = {
	code: 'jm',
	name: {
		en: 'Jamaica',
		ar: 'جامايكا',
		de: 'Jamaika',
		sv: 'Jamaica',
		da: 'Jamaica',
		sq: 'Xhamajka',
		pt: 'Jamaica',
		tr: 'Jamaika',
		fa: 'جامائیکا',
		uk: 'Ямайка',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇯🇲',
}
