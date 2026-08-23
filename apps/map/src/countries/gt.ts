import { Country } from './Country'

export const gt: Country = {
	code: 'gt',
	name: {
		en: 'Guatemala',
		ar: 'غواتيمالا',
		de: 'Guatemala',
		sv: 'Guatemala',
		da: 'Guatemala',
		sq: 'Guatemala',
		pt: 'Guatemala',
		tr: 'Guatemala',
		fa: 'گواتمالا',
		uk: 'Гватемала',
		// display-only — these three interface languages have no recordings
		el: 'Γουατεμάλα',
		th: 'กัวเตมาลา',
		zh: '危地马拉',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇬🇹',
}
