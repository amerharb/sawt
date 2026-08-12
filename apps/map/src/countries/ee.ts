import { Country } from './Country'

export const ee: Country = {
	code: 'ee',
	name: {
		en: 'Estonia',
		ar: 'إستونيا',
		de: 'Estland',
		sv: 'Estland',
		da: 'Estland',
		sq: 'Estonia',
		pt: 'Estónia',
		tr: 'Estonya',
		fa: 'استونی',
		uk: 'Естонія',
		// display-only — these three interface languages have no recordings
		el: 'Εσθονία',
		th: 'เอสโตเนีย',
		zh: '爱沙尼亚',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇪🇪',
}
