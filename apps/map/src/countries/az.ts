import { Country } from './Country'

export const az: Country = {
	code: 'az',
	name: {
		en: 'Azerbaijan',
		ar: 'أذربيجان',
		de: 'Aserbaidschan',
		sv: 'Azerbajdzjan',
		da: 'Aserbajdsjan',
		sq: 'Azerbajxhani',
		pt: 'Azerbaijão',
		tr: 'Azerbaycan',
		fa: 'آذربایجان',
		uk: 'Азербайджан',
		// display-only — these three interface languages have no recordings
		el: 'Αζερμπαϊτζάν',
		th: 'อาเซอร์ไบจาน',
		zh: '阿塞拜疆',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇦🇿',
}
