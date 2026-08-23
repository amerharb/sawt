import { Country } from './Country'

export const pk: Country = {
	code: 'pk',
	name: {
		en: 'Pakistan',
		ar: 'باكستان',
		de: 'Pakistan',
		sv: 'Pakistan',
		da: 'Pakistan',
		sq: 'Pakistani',
		pt: 'Paquistão',
		tr: 'Pakistan',
		fa: 'پاکستان',
		uk: 'Пакистан',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇵🇰',
}
