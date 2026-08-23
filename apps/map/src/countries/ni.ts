import { Country } from './Country'

export const ni: Country = {
	code: 'ni',
	name: {
		en: 'Nicaragua',
		ar: 'نيكاراغوا',
		de: 'Nicaragua',
		sv: 'Nicaragua',
		da: 'Nicaragua',
		sq: 'Nikaragua',
		pt: 'Nicarágua',
		tr: 'Nikaragua',
		fa: 'نیکاراگوئه',
		uk: 'Нікарагуа',
		// display-only — these three interface languages have no recordings
		el: 'Νικαράγουα',
		th: 'นิการากัว',
		zh: '尼加拉瓜',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇳🇮',
}
