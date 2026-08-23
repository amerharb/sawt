import { Country } from './Country'

export const sn: Country = {
	code: 'sn',
	name: {
		en: 'Senegal',
		ar: 'السنغال',
		de: 'Senegal',
		sv: 'Senegal',
		da: 'Senegal',
		sq: 'Senegali',
		pt: 'Senegal',
		tr: 'Senegal',
		fa: 'سنگال',
		uk: 'Сенегал',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇸🇳',
}
