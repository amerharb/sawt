import { Country } from './Country'

export const sl: Country = {
	code: 'sl',
	name: {
		en: 'Sierra Leone',
		ar: 'سيراليون',
		de: 'Sierra Leone',
		sv: 'Sierra Leone',
		da: 'Sierra Leone',
		sq: 'Sierra Leone',
		pt: 'Serra Leoa',
		tr: 'Sierra Leone',
		fa: 'سیرالئون',
		uk: 'Сьєрра-Леоне',
		// display-only — these three interface languages have no recordings
		el: 'Σιέρα Λεόνε',
		th: 'เซียร์ราลีโอน',
		zh: '塞拉利昂',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇸🇱',
}
