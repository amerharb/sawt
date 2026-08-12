import { Country } from './Country'

export const ie: Country = {
	code: 'ie',
	name: {
		en: 'Ireland',
		ar: 'أيرلندا',
		de: 'Irland',
		sv: 'Irland',
		da: 'Irland',
		sq: 'Irlanda',
		pt: 'Irlanda',
		tr: 'İrlanda',
		fa: 'ایرلند',
		uk: 'Ірландія',
		// display-only — these three interface languages have no recordings
		el: 'Ιρλανδία',
		th: 'ไอร์แลนด์',
		zh: '爱尔兰',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇮🇪',
}
