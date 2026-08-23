import { Country } from './Country'

export const bj: Country = {
	code: 'bj',
	name: {
		en: 'Benin',
		ar: 'بنين',
		de: 'Benin',
		sv: 'Benin',
		da: 'Benin',
		sq: 'Benini',
		pt: 'Benim',
		tr: 'Benin',
		fa: 'بنین',
		uk: 'Бенін',
		// display-only — these three interface languages have no recordings
		el: 'Μπενίν',
		th: 'เบนิน',
		zh: '贝宁',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇧🇯',
}
