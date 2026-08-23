import { Country } from './Country'

export const tz: Country = {
	code: 'tz',
	name: {
		en: 'Tanzania',
		ar: 'تنزانيا',
		de: 'Tansania',
		sv: 'Tanzania',
		da: 'Tanzania',
		sq: 'Tanzania',
		pt: 'Tanzânia',
		tr: 'Tanzanya',
		fa: 'تانزانیا',
		uk: 'Танзанія',
		// display-only — these three interface languages have no recordings
		el: 'Τανζανία',
		th: 'แทนซาเนีย',
		zh: '坦桑尼亚',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇹🇿',
}
