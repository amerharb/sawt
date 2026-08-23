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
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇧🇴',
}
