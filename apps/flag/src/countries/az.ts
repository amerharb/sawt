import { Country } from './Country'

export const az: Country = {
	code: 'az',
	name: {
		en: 'Azerbaijan',
		ar: 'أذربيجان',
		de: 'Aserbaidschan',
		sv: 'Azerbajdzjan',
		da: 'Aserbajdsjan',
		sq: 'Azerbajxhani',
		pt: 'Azerbaijão',
		tr: 'Azerbaycan',
		fa: 'آذربایجان',
		uk: 'Азербайджан',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇦🇿',
}
