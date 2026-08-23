import { Country } from './Country'

export const gy: Country = {
	code: 'gy',
	name: {
		en: 'Guyana',
		ar: 'غيانا',
		de: 'Guyana',
		sv: 'Guyana',
		da: 'Guyana',
		sq: 'Guajana',
		pt: 'Guiana',
		tr: 'Guyana',
		fa: 'گویان',
		uk: 'Гаяна',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇬🇾',
}
