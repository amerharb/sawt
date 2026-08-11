import { Country } from './Country'

export const dz: Country = {
	code: 'dz',
	name: {
		en: 'Algeria',
		ar: 'الجزائر',
		de: 'Algerien',
		sv: 'Algeriet',
		da: 'Algeriet',
		sq: 'Algjeria',
		pt: 'Argélia',
		tr: 'Cezayir',
		fa: 'الجزایر',
		uk: 'Алжир',
	},
	// the three interface languages the sound set lacks — hover names only.
	label: {
		el: 'Αλγερία',
		th: 'แอลจีเรีย',
		zh: '阿尔及利亚',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇩🇿',
}
