import { Country } from './Country'

export const sc: Country = {
	code: 'sc',
	name: {
		en: 'Seychelles',
		ar: 'سيشل',
		de: 'Seychellen',
		sv: 'Seychellerna',
		da: 'Seychellerne',
		sq: 'Sejshellet',
		pt: 'Seicheles',
		tr: 'Seyşeller',
		fa: 'سیشل',
		uk: 'Сейшельські Острови',
		// display-only — these three interface languages have no recordings
		el: 'Σεϋχέλλες',
		th: 'เซเชลส์',
		zh: '塞舌尔',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇸🇨',
}
