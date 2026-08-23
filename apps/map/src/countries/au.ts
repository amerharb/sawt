import { Country } from './Country'

export const au: Country = {
	code: 'au',
	name: {
		en: 'Australia',
		ar: 'أستراليا',
		de: 'Australien',
		sv: 'Australien',
		da: 'Australien',
		sq: 'Australia',
		pt: 'Austrália',
		tr: 'Avustralya',
		fa: 'استرالیا',
		uk: 'Австралія',
		// display-only — these three interface languages have no recordings
		el: 'Αυστραλία',
		th: 'ออสเตรเลีย',
		zh: '澳大利亚',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇦🇺',
}
