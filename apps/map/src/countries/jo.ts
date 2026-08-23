import { Country } from './Country'

export const jo: Country = {
	code: 'jo',
	name: {
		en: 'Jordan',
		ar: 'الأردن',
		de: 'Jordanien',
		sv: 'Jordanien',
		da: 'Jordan',
		sq: 'Jordania',
		pt: 'Jordânia',
		tr: 'Ürdün',
		fa: 'اردن',
		uk: 'Йорданія',
		// display-only — these three interface languages have no recordings
		el: 'Ιορδανία',
		th: 'จอร์แดน',
		zh: '约旦',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇯🇴',
}
