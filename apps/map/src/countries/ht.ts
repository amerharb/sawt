import { Country } from './Country'

export const ht: Country = {
	code: 'ht',
	name: {
		en: 'Haiti',
		ar: 'هايتي',
		de: 'Haiti',
		sv: 'Haiti',
		da: 'Haiti',
		sq: 'Haiti',
		pt: 'Haiti',
		tr: 'Haiti',
		fa: 'هائیتی',
		uk: 'Гаїті',
		// display-only — these three interface languages have no recordings
		el: 'Αϊτή',
		th: 'เฮติ',
		zh: '海地',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇭🇹',
}
