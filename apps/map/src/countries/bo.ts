import { Country } from './Country'

export const bo: Country = {
	code: 'bo',
	name: {
		en: 'Bolivia',
		ar: 'بوليفيا',
		de: 'Bolivien',
		sv: 'Bolivia',
		da: 'Bolivia',
		sq: 'Bolivia',
		pt: 'Bolívia',
		tr: 'Bolivya',
		fa: 'بولیوی',
		uk: 'Болівія',
		// display-only — these three interface languages have no recordings
		el: 'Βολιβία',
		th: 'โบลิเวีย',
		zh: '玻利维亚',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇧🇴',
}
