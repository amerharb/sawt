import { Country } from './Country'

export const cg: Country = {
	code: 'cg',
	name: {
		en: 'Republic of the Congo',
		ar: 'جمهورية الكونغو',
		de: 'Republik Kongo',
		sv: 'Republiken Kongo',
		da: 'Republikken Congo',
		sq: 'Republika e Kongos',
		pt: 'República do Congo',
		tr: 'Kongo Cumhuriyeti',
		fa: 'جمهوری کنگو',
		uk: 'Республіка Конго',
		// display-only — these three interface languages have no recordings
		el: 'Δημοκρατία του Κονγκό',
		th: 'สาธารณรัฐคองโก',
		zh: '刚果共和国',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇨🇬',
}
