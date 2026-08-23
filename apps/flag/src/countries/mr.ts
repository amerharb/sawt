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
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇲🇷',
}
