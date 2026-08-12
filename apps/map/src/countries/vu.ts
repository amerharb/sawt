import { Country } from './Country'

export const vu: Country = {
	code: 'vu',
	name: {
		en: 'Vanuatu',
		ar: 'فانواتو',
		de: 'Vanuatu',
		sv: 'Vanuatu',
		da: 'Vanuatu',
		sq: 'Vanuatu',
		pt: 'Vanuatu',
		tr: 'Vanuatu',
		fa: 'وانواتو',
		uk: 'Вануату',
		// display-only — these three interface languages have no recordings
		el: 'Βανουάτου',
		th: 'วานูอาตู',
		zh: '瓦努阿图',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇻🇺',
}
