import { Country } from './Country'

export const sv: Country = {
	code: 'sv',
	name: {
		en: 'El Salvador',
		ar: 'السلفادور',
		de: 'El Salvador',
		sv: 'El Salvador',
		da: 'El Salvador',
		sq: 'El Salvador',
		pt: 'El Salvador',
		tr: 'El Salvador',
		fa: 'السالوادور',
		uk: 'Сальвадор',
		// display-only — these three interface languages have no recordings
		el: 'Ελ Σαλβαδόρ',
		th: 'เอลซัลวาดอร์',
		zh: '萨尔瓦多',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇸🇻',
}
