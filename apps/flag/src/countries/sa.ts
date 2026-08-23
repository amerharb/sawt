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
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇸🇦',
}
