import { Country } from './Country'

export const gl: Country = {
	code: 'gl',
	name: {
		en: 'Greenland',
		ar: 'غرينلاند',
		de: 'Grönland',
		sv: 'Grönland',
		da: 'Grønland',
		sq: 'Grenlanda',
		pt: 'Gronelândia',
		tr: 'Grönland',
		fa: 'گرینلند',
		uk: 'Гренландія',
		// display-only — these three interface languages have no recordings
		el: 'Γροιλανδία',
		th: 'กรีนแลนด์',
		zh: '格陵兰',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇬🇱',
}
