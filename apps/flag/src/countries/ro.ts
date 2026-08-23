import { Country } from './Country'

export const ro: Country = {
	code: 'ro',
	name: {
		en: 'Romania',
		ar: 'رومانيا',
		de: 'Rumänien',
		sv: 'Rumänien',
		da: 'Rumænien',
		sq: 'Rumania',
		pt: 'Roménia',
		tr: 'Romanya',
		fa: 'رومانی',
		uk: 'Румунія',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇷🇴',
}
