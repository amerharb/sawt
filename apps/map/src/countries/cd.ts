import { Country } from './Country'

export const cd: Country = {
	code: 'cd',
	name: {
		en: 'Democratic Republic of the Congo',
		ar: 'جمهورية الكونغو الديمقراطية',
		de: 'Demokratische Republik Kongo',
		sv: 'Demokratiska republiken Kongo',
		da: 'Den Demokratiske Republik Congo',
		sq: 'Republika Demokratike e Kongos',
		pt: 'República Democrática do Congo',
		tr: 'Demokratik Kongo Cumhuriyeti',
		fa: 'جمهوری دموکراتیک کنگو',
		uk: 'Демократична Республіка Конго',
		// display-only — these three interface languages have no recordings
		el: 'Λαϊκή Δημοκρατία του Κονγκό',
		th: 'สาธารณรัฐประชาธิปไตยคองโก',
		zh: '刚果民主共和国',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇨🇩',
}
