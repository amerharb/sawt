import { Country } from './Country'

export const ru: Country = {
	code: 'ru',
	name: {
		en: 'Russia',
		ar: 'روسيا',
		de: 'Russland',
		sv: 'Ryssland',
		da: 'Rusland',
		sq: 'Rusia',
		pt: 'Rússia',
		tr: 'Rusya',
		fa: 'روسیه',
		uk: 'Росія',
	},
	// the three interface languages the sound set lacks — hover names only.
	label: {
		el: 'Ρωσία',
		th: 'รัสเซีย',
		zh: '俄罗斯',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇷🇺',
}
