import { Country } from './Country'

export const af: Country = {
	code: 'af',
	name: {
		en: 'Afghanistan',
		ar: 'أفغانستان',
		de: 'Afghanistan',
		sv: 'Afghanistan',
		da: 'Afghanistan',
		sq: 'Afganistani',
		pt: 'Afeganistão',
		tr: 'Afganistan',
		fa: 'افغانستان',
		uk: 'Афганістан',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇦🇫',
}
