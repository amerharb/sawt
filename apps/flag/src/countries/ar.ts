import { Country } from './Country'

export const ar: Country = {
	code: 'ar',
	name: {
		en: 'Argentina',
		ar: 'الأرجنتين',
		de: 'Argentinien',
		sv: 'Argentina',
		da: 'Argentina',
		sq: 'Argjentina',
		pt: 'Argentina',
		tr: 'Arjantin',
		fa: 'آرژانتین',
		uk: 'Аргентина',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇦🇷',
}
