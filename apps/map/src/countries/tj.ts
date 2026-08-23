import { Country } from './Country'

export const tj: Country = {
	code: 'tj',
	name: {
		en: 'Tajikistan',
		ar: 'طاجيكستان',
		de: 'Tadschikistan',
		sv: 'Tadzjikistan',
		da: 'Tadsjikistan',
		sq: 'Taxhikistani',
		pt: 'Tajiquistão',
		tr: 'Tacikistan',
		fa: 'تاجیکستان',
		uk: 'Таджикистан',
		// display-only — these three interface languages have no recordings
		el: 'Τατζικιστάν',
		th: 'ทาจิกิสถาน',
		zh: '塔吉克斯坦',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇹🇯',
}
