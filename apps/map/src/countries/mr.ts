import { Country } from './Country'

export const mr: Country = {
	code: 'mr',
	name: {
		en: 'Mauritania',
		ar: 'موريتانيا',
		de: 'Mauretanien',
		sv: 'Mauretanien',
		da: 'Mauretanien',
		sq: 'Mauritania',
		pt: 'Mauritânia',
		tr: 'Moritanya',
		fa: 'موریتانی',
		uk: 'Мавританія',
		// display-only — these three interface languages have no recordings
		el: 'Μαυριτανία',
		th: 'มอริเตเนีย',
		zh: '毛里塔尼亚',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇲🇷',
}
