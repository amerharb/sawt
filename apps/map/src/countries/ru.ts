import { Country } from './Country'

export const ru: Country = {
	code: 'ru',
	name: {
		en: 'Russia',
		ar: 'روسيا',
		de: 'Russland',
		sv: 'Ryssland',
		da: 'Rusland',
		sq: 'Rusia',
		pt: 'Rússia',
		tr: 'Rusya',
		fa: 'روسیه',
		uk: 'Росія',
		// display-only — these three interface languages have no recordings
		el: 'Ρωσία',
		th: 'รัสเซีย',
		zh: '俄罗斯',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇷🇺',
}
