import { Country } from './Country'

export const gn: Country = {
	code: 'gn',
	name: {
		en: 'Guinea',
		ar: 'غينيا',
		de: 'Guinea',
		sv: 'Guinea',
		da: 'Guinea',
		sq: 'Guineja',
		pt: 'Guiné',
		tr: 'Gine',
		fa: 'گینه',
		uk: 'Гвінея',
		// display-only — these three interface languages have no recordings
		el: 'Γουινέα',
		th: 'กินี',
		zh: '几内亚',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇬🇳',
}
