import { Country } from './Country'

export const ne: Country = {
	code: 'ne',
	name: {
		en: 'Niger',
		ar: 'النيجر',
		de: 'Niger',
		sv: 'Niger',
		da: 'Niger',
		sq: 'Nigeri',
		pt: 'Níger',
		tr: 'Nijer',
		fa: 'نیجر',
		uk: 'Нігер',
		// display-only — these three interface languages have no recordings
		el: 'Νίγηρας',
		th: 'ไนเจอร์',
		zh: '尼日尔',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇳🇪',
}
