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
		// display-only — these three interface languages have no recordings
		el: 'Άγιος Χριστόφορος και Νέβις',
		th: 'เซนต์คิตส์และเนวิส',
		zh: '圣基茨和尼维斯',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇰🇳',
}
