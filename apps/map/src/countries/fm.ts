import { Country } from './Country'

export const fm: Country = {
	code: 'fm',
	name: {
		en: 'Micronesia',
		ar: 'ميكرونيزيا',
		de: 'Mikronesien',
		sv: 'Mikronesien',
		da: 'Mikronesien',
		sq: 'Mikronezia',
		pt: 'Micronésia',
		tr: 'Mikronezya',
		fa: 'میکرونزی',
		uk: 'Мікронезія',
		// display-only — these three interface languages have no recordings
		el: 'Μικρονησία',
		th: 'ไมโครนีเซีย',
		zh: '密克罗尼西亚',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇫🇲',
}
