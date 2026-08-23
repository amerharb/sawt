import { Country } from './Country'

export const si: Country = {
	code: 'si',
	name: {
		en: 'Slovenia',
		ar: 'سلوفينيا',
		de: 'Slowenien',
		sv: 'Slovenien',
		da: 'Slovenien',
		sq: 'Sllovenia',
		pt: 'Eslovénia',
		tr: 'Slovenya',
		fa: 'اسلوونی',
		uk: 'Словенія',
		// display-only — these three interface languages have no recordings
		el: 'Σλοβενία',
		th: 'สโลวีเนีย',
		zh: '斯洛文尼亚',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇸🇮',
}
