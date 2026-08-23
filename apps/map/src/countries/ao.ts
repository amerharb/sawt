import { Country } from './Country'

export const ao: Country = {
	code: 'ao',
	name: {
		en: 'Angola',
		ar: 'أنغولا',
		de: 'Angola',
		sv: 'Angola',
		da: 'Angola',
		sq: 'Angola',
		pt: 'Angola',
		tr: 'Angola',
		fa: 'آنگولا',
		uk: 'Ангола',
		// display-only — these three interface languages have no recordings
		el: 'Αγκόλα',
		th: 'แองโกลา',
		zh: '安哥拉',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇦🇴',
}
