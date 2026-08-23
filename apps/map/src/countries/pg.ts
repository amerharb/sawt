import { Country } from './Country'

export const pg: Country = {
	code: 'pg',
	name: {
		en: 'Papua New Guinea',
		ar: 'بابوا غينيا الجديدة',
		de: 'Papua-Neuguinea',
		sv: 'Papua Nya Guinea',
		da: 'Papua Ny Guinea',
		sq: 'Papua Guineja e Re',
		pt: 'Papua-Nova Guiné',
		tr: 'Papua Yeni Gine',
		fa: 'پاپوآ گینه نو',
		uk: 'Папуа Нова Гвінея',
		// display-only — these three interface languages have no recordings
		el: 'Παπούα Νέα Γουινέα',
		th: 'ปาปัวนิวกินี',
		zh: '巴布亚新几内亚',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇵🇬',
}
