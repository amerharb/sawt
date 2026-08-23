import { Country } from './Country'

export const id: Country = {
	code: 'id',
	name: {
		en: 'Indonesia',
		ar: 'إندونيسيا',
		de: 'Indonesien',
		sv: 'Indonesien',
		da: 'Indonesien',
		sq: 'Indonezia',
		pt: 'Indonésia',
		tr: 'Endonezya',
		fa: 'اندونزی',
		uk: 'Індонезія',
		// display-only — these three interface languages have no recordings
		el: 'Ινδονησία',
		th: 'อินโดนีเซีย',
		zh: '印度尼西亚',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇮🇩',
}
