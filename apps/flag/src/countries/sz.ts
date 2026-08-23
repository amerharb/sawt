import { Country } from './Country'

export const sz: Country = {
	code: 'sz',
	name: {
		en: 'Eswatini',
		ar: 'إسواتيني',
		de: 'Eswatini',
		sv: 'Eswatini',
		da: 'Eswatini',
		sq: 'Esvatini',
		pt: 'Essuatíni',
		tr: 'Esvatini',
		fa: 'اسواتینی',
		uk: 'Есватіні',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇸🇿',
}
