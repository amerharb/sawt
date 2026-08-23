import { Country } from './Country'

export const py: Country = {
	code: 'py',
	name: {
		en: 'Paraguay',
		ar: 'باراغواي',
		de: 'Paraguay',
		sv: 'Paraguay',
		da: 'Paraguay',
		sq: 'Paraguai',
		pt: 'Paraguai',
		tr: 'Paraguay',
		fa: 'پاراگوئه',
		uk: 'Парагвай',
		// display-only — these three interface languages have no recordings
		el: 'Παραγουάη',
		th: 'ปารากวัย',
		zh: '巴拉圭',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇵🇾',
}
