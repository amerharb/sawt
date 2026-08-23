import { Country } from './Country'

export const bn: Country = {
	code: 'bn',
	name: {
		en: 'Brunei',
		ar: 'بروناي',
		de: 'Brunei',
		sv: 'Brunei',
		da: 'Brunei',
		sq: 'Bruneji',
		pt: 'Brunei',
		tr: 'Brunei',
		fa: 'برونئی',
		uk: 'Бруней',
		// display-only — these three interface languages have no recordings
		el: 'Μπρουνέι',
		th: 'บรูไน',
		zh: '文莱',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇧🇳',
}
