import { Country } from './Country'

export const ve: Country = {
	code: 've',
	name: {
		en: 'Venezuela',
		ar: 'فنزويلا',
		de: 'Venezuela',
		sv: 'Venezuela',
		da: 'Venezuela',
		sq: 'Venezuela',
		pt: 'Venezuela',
		tr: 'Venezuela',
		fa: 'ونزوئلا',
		uk: 'Венесуела',
		// display-only — these three interface languages have no recordings
		el: 'Βενεζουέλα',
		th: 'เวเนซุเอลา',
		zh: '委内瑞拉',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇻🇪',
}
