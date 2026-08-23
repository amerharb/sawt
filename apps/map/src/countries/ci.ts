import { Country } from './Country'

export const ci: Country = {
	code: 'ci',
	name: {
		en: 'Ivory Coast',
		ar: 'ساحل العاج',
		de: 'Elfenbeinküste',
		sv: 'Elfenbenskusten',
		da: 'Elfenbenskysten',
		sq: 'Bregu i Fildishtë',
		pt: 'Costa do Marfim',
		tr: 'Fildişi Sahili',
		fa: 'ساحل عاج',
		uk: 'Кот-д\'Івуар',
		// display-only — these three interface languages have no recordings
		el: 'Ακτή Ελεφαντοστού',
		th: 'โกตดิวัวร์',
		zh: '科特迪瓦',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇨🇮',
}
