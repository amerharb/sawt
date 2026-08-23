import { Country } from './Country'

export const sr: Country = {
	code: 'sr',
	name: {
		en: 'Suriname',
		ar: 'سورينام',
		de: 'Suriname',
		sv: 'Surinam',
		da: 'Surinam',
		sq: 'Surinami',
		pt: 'Suriname',
		tr: 'Surinam',
		fa: 'سورینام',
		uk: 'Суринам',
		// display-only — these three interface languages have no recordings
		el: 'Σουρινάμ',
		th: 'ซูรินาม',
		zh: '苏里南',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇸🇷',
}
