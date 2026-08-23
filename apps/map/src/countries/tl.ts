import { Country } from './Country'

export const tl: Country = {
	code: 'tl',
	name: {
		en: 'East Timor',
		ar: 'تيمور الشرقية',
		de: 'Osttimor',
		sv: 'Östtimor',
		da: 'Østtimor',
		sq: 'Timori Lindor',
		pt: 'Timor-Leste',
		tr: 'Doğu Timor',
		fa: 'تیمور شرقی',
		uk: 'Східний Тимор',
		// display-only — these three interface languages have no recordings
		el: 'Ανατολικό Τιμόρ',
		th: 'ติมอร์-เลสเต',
		zh: '东帝汶',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇹🇱',
}
