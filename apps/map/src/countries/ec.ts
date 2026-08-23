import { Country } from './Country'

export const ec: Country = {
	code: 'ec',
	name: {
		en: 'Ecuador',
		ar: 'الإكوادور',
		de: 'Ecuador',
		sv: 'Ecuador',
		da: 'Ecuador',
		sq: 'Ekuadori',
		pt: 'Equador',
		tr: 'Ekvador',
		fa: 'اکوادور',
		uk: 'Еквадор',
		// display-only — these three interface languages have no recordings
		el: 'Εκουαδόρ',
		th: 'เอกวาดอร์',
		zh: '厄瓜多尔',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇪🇨',
}
