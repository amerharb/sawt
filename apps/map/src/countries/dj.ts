import { Country } from './Country'

export const dj: Country = {
	code: 'dj',
	name: {
		en: 'Djibouti',
		ar: 'جيبوتي',
		de: 'Dschibuti',
		sv: 'Djibouti',
		da: 'Djibouti',
		sq: 'Xhibuti',
		pt: 'Djibuti',
		tr: 'Cibuti',
		fa: 'جیبوتی',
		uk: 'Джибуті',
		// display-only — these three interface languages have no recordings
		el: 'Τζιμπουτί',
		th: 'จิบูตี',
		zh: '吉布提',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇩🇯',
}
