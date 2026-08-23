import { Country } from './Country'

export const uy: Country = {
	code: 'uy',
	name: {
		en: 'Uruguay',
		ar: 'الأوروغواي',
		de: 'Uruguay',
		sv: 'Uruguay',
		da: 'Uruguay',
		sq: 'Uruguai',
		pt: 'Uruguai',
		tr: 'Uruguay',
		fa: 'اروگوئه',
		uk: 'Уругвай',
		// display-only — these three interface languages have no recordings
		el: 'Ουρουγουάη',
		th: 'อุรุกวัย',
		zh: '乌拉圭',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇺🇾',
}
