import { Country } from './Country'

export const kn: Country = {
	code: 'kn',
	name: {
		en: 'Saint Kitts and Nevis',
		ar: 'سانت كيتس ونيفيس',
		de: 'St. Kitts und Nevis',
		sv: 'Saint Kitts och Nevis',
		da: 'Saint Kitts og Nevis',
		sq: 'Shën Kitts dhe Nevis',
		pt: 'São Cristóvão e Neves',
		tr: 'Saint Kitts ve Nevis',
		fa: 'سنت کیتس و نویس',
		uk: 'Сент-Кіттс і Невіс',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇰🇳',
}
