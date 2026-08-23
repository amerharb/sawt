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
		// display-only — these three interface languages have no recordings
		el: 'Πακιστάν',
		th: 'ปากีสถาน',
		zh: '巴基斯坦',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇵🇰',
}
