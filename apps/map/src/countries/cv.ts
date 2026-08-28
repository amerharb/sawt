import { Country } from './Country'

export const cv: Country = {
	code: 'cv',
	name: {
		en: 'Cape Verde',
		ar: 'الرأس الأخضر',
		de: 'Kap Verde',
		sv: 'Kap Verde',
		da: 'Kap Verde',
		sq: 'Kepi i Gjelbër',
		pt: 'Cabo Verde',
		tr: 'Yeşil Burun Adaları',
		fa: 'کیپ ورد',
		uk: 'Кабо-Верде',
		// display-only — these three interface languages have no recordings
		el: 'Πράσινο Ακρωτήριο',
		th: 'กาบูเวร์ดี',
		zh: '佛得角',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇨🇻',
}
