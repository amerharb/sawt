import { Country } from './Country'

export const zw: Country = {
	code: 'zw',
	name: {
		en: 'Zimbabwe',
		ar: 'زيمبابوي',
		de: 'Simbabwe',
		sv: 'Zimbabwe',
		da: 'Zimbabwe',
		sq: 'Zimbabve',
		pt: 'Zimbábue',
		tr: 'Zimbabve',
		fa: 'زیمبابوه',
		uk: 'Зімбабве',
		// display-only — these three interface languages have no recordings
		el: 'Ζιμπάμπουε',
		th: 'ซิมบับเว',
		zh: '津巴布韦',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇿🇼',
}
