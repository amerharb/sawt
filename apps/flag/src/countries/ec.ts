import { Country } from './Country'

export const ec: Country = {
	code: 'ec',
	name: {
		en: 'Ecuador',
		ar: 'الإكوادور',
		de: 'Ecuador',
		sv: 'Ecuador',
		da: 'Ecuador',
		sq: 'Ekuadori',
		pt: 'Equador',
		tr: 'Ekvador',
		fa: 'اکوادور',
		uk: 'Еквадор',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇪🇨',
}
