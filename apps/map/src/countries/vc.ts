import { Country } from './Country'

export const vc: Country = {
	code: 'vc',
	name: {
		en: 'Saint Vincent and the Grenadines',
		ar: 'سانت فنسنت والغرينادين',
		de: 'St. Vincent und die Grenadinen',
		sv: 'Saint Vincent och Grenadinerna',
		da: 'Saint Vincent og Grenadinerne',
		sq: 'Shën Vincenti dhe Grenadinet',
		pt: 'São Vicente e Granadinas',
		tr: 'Saint Vincent ve Grenadinler',
		fa: 'سنت وینسنت و گرنادین‌ها',
		uk: 'Сент-Вінсент і Гренадини',
		// display-only — these three interface languages have no recordings
		el: 'Άγιος Βικέντιος και Γρεναδίνες',
		th: 'เซนต์วินเซนต์และเกรนาดีนส์',
		zh: '圣文森特和格林纳丁斯',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇻🇨',
}
