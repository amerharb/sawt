import { Country } from './Country'

export const za: Country = {
	code: 'za',
	name: {
		en: 'South Africa',
		ar: 'جنوب أفريقيا',
		de: 'Südafrika',
		sv: 'Sydafrika',
		da: 'Sydafrika',
		sq: 'Afrika e Jugut',
		pt: 'África do Sul',
		tr: 'Güney Afrika',
		fa: 'آفریقای جنوبی',
		uk: 'Південна Африка',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇿🇦',
}
