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
		// display-only — these three interface languages have no recordings
		el: 'Αλγερία',
		th: 'แอลจีเรีย',
		zh: '阿尔及利亚',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇩🇿',
}
