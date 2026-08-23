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
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇹🇯',
}
