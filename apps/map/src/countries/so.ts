import { Country } from './Country'

export const so: Country = {
	code: 'so',
	name: {
		en: 'Somalia',
		ar: 'الصومال',
		de: 'Somalia',
		sv: 'Somalia',
		da: 'Somalia',
		sq: 'Somalia',
		pt: 'Somália',
		tr: 'Somali',
		fa: 'سومالی',
		uk: 'Сомалі',
		// display-only — these three interface languages have no recordings
		el: 'Σομαλία',
		th: 'โซมาเลีย',
		zh: '索马里',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇸🇴',
}
