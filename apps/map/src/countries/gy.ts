import { Country } from './Country'

export const gy: Country = {
	code: 'gy',
	name: {
		en: 'Guyana',
		ar: 'غيانا',
		de: 'Guyana',
		sv: 'Guyana',
		da: 'Guyana',
		sq: 'Guajana',
		pt: 'Guiana',
		tr: 'Guyana',
		fa: 'گویان',
		uk: 'Гаяна',
		// display-only — these three interface languages have no recordings
		el: 'Γουιάνα',
		th: 'กายอานา',
		zh: '圭亚那',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇬🇾',
}
