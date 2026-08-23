import { Country } from './Country'

export const cf: Country = {
	code: 'cf',
	name: {
		en: 'Central African Republic',
		ar: 'جمهورية أفريقيا الوسطى',
		de: 'Zentralafrikanische Republik',
		sv: 'Centralafrikanska republiken',
		da: 'Den Centralafrikanske Republik',
		sq: 'Republika e Afrikës Qendrore',
		pt: 'República Centro-Africana',
		tr: 'Orta Afrika Cumhuriyeti',
		fa: 'جمهوری آفریقای مرکزی',
		uk: 'Центральноафриканська Республіка',
		// display-only — these three interface languages have no recordings
		el: 'Κεντροαφρικανική Δημοκρατία',
		th: 'สาธารณรัฐแอฟริกากลาง',
		zh: '中非共和国',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇨🇫',
}
