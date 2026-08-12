import { Country } from './Country'

export const sa: Country = {
	code: 'sa',
	name: {
		en: 'Saudi Arabia',
		ar: 'السعودية',
		de: 'Saudi-Arabien',
		sv: 'Saudiarabien',
		da: 'Saudi-Arabien',
		sq: 'Arabia Saudite',
		pt: 'Arábia Saudita',
		tr: 'Suudi Arabistan',
		fa: 'عربستان سعودی',
		uk: 'Саудівська Аравія',
		// display-only — these three interface languages have no recordings
		el: 'Σαουδική Αραβία',
		th: 'ซาอุดีอาระเบีย',
		zh: '沙特阿拉伯',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇸🇦',
}
