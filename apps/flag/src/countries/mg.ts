import { Country } from './Country'

export const mg: Country = {
	code: 'mg',
	name: {
		en: 'Madagascar',
		ar: 'مدغشقر',
		de: 'Madagaskar',
		sv: 'Madagaskar',
		da: 'Madagaskar',
		sq: 'Madagaskari',
		pt: 'Madagáscar',
		tr: 'Madagaskar',
		fa: 'ماداگاسکار',
		uk: 'Мадагаскар',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇲🇬',
}
