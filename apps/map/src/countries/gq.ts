import { Country } from './Country'

export const gq: Country = {
	code: 'gq',
	name: {
		en: 'Equatorial Guinea',
		ar: 'غينيا الاستوائية',
		de: 'Äquatorialguinea',
		sv: 'Ekvatorialguinea',
		da: 'Ækvatorialguinea',
		sq: 'Guineja Ekuatoriale',
		pt: 'Guiné Equatorial',
		tr: 'Ekvator Ginesi',
		fa: 'گینه استوایی',
		uk: 'Екваторіальна Гвінея',
		// display-only — these three interface languages have no recordings
		el: 'Ισημερινή Γουινέα',
		th: 'อิเควทอเรียลกินี',
		zh: '赤道几内亚',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇬🇶',
}
