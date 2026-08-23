import { Country } from './Country'

export const jm: Country = {
	code: 'jm',
	name: {
		en: 'Jamaica',
		ar: 'جامايكا',
		de: 'Jamaika',
		sv: 'Jamaica',
		da: 'Jamaica',
		sq: 'Xhamajka',
		pt: 'Jamaica',
		tr: 'Jamaika',
		fa: 'جامائیکا',
		uk: 'Ямайка',
		// display-only — these three interface languages have no recordings
		el: 'Τζαμάικα',
		th: 'จาเมกา',
		zh: '牙买加',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇯🇲',
}
