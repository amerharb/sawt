import { Country } from './Country'

export const am: Country = {
	code: 'am',
	name: {
		en: 'Armenia',
		ar: 'أرمينيا',
		de: 'Armenien',
		sv: 'Armenien',
		da: 'Armenien',
		sq: 'Armenia',
		pt: 'Arménia',
		tr: 'Ermenistan',
		fa: 'ارمنستان',
		uk: 'Вірменія',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇦🇲',
}
