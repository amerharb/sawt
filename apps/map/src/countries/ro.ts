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
		// display-only — these three interface languages have no recordings
		el: 'Ρουμανία',
		th: 'โรมาเนีย',
		zh: '罗马尼亚',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇷🇴',
}
