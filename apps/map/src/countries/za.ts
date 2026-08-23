import { Country } from './Country'

export const za: Country = {
	code: 'za',
	name: {
		en: 'South Africa',
		ar: 'جنوب أفريقيا',
		de: 'Südafrika',
		sv: 'Sydafrika',
		da: 'Sydafrika',
		sq: 'Afrika e Jugut',
		pt: 'África do Sul',
		tr: 'Güney Afrika',
		fa: 'آفریقای جنوبی',
		uk: 'Південна Африка',
		// display-only — these three interface languages have no recordings
		el: 'Νότια Αφρική',
		th: 'แอฟริกาใต้',
		zh: '南非',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇿🇦',
}
