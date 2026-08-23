import { Country } from './Country'

export const sg: Country = {
	code: 'sg',
	name: {
		en: 'Singapore',
		ar: 'سنغافورة',
		de: 'Singapur',
		sv: 'Singapore',
		da: 'Singapore',
		sq: 'Singapori',
		pt: 'Singapura',
		tr: 'Singapur',
		fa: 'سنگاپور',
		uk: 'Сінгапур',
		// display-only — these three interface languages have no recordings
		el: 'Σιγκαπούρη',
		th: 'สิงคโปร์',
		zh: '新加坡',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇸🇬',
}
