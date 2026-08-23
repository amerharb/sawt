import { Country } from './Country'

export const pa: Country = {
	code: 'pa',
	name: {
		en: 'Panama',
		ar: 'بنما',
		de: 'Panama',
		sv: 'Panama',
		da: 'Panama',
		sq: 'Panamaja',
		pt: 'Panamá',
		tr: 'Panama',
		fa: 'پاناما',
		uk: 'Панама',
		// display-only — these three interface languages have no recordings
		el: 'Παναμάς',
		th: 'ปานามา',
		zh: '巴拿马',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇵🇦',
}
