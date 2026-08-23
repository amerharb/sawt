import { Country } from './Country'

export const ug: Country = {
	code: 'ug',
	name: {
		en: 'Uganda',
		ar: 'أوغندا',
		de: 'Uganda',
		sv: 'Uganda',
		da: 'Uganda',
		sq: 'Uganda',
		pt: 'Uganda',
		tr: 'Uganda',
		fa: 'اوگاندا',
		uk: 'Уганда',
		// display-only — these three interface languages have no recordings
		el: 'Ουγκάντα',
		th: 'ยูกันดา',
		zh: '乌干达',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇺🇬',
}
