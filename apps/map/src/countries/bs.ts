import { Country } from './Country'

export const bs: Country = {
	code: 'bs',
	name: {
		en: 'Bahamas',
		ar: 'جزر البهاما',
		de: 'Bahamas',
		sv: 'Bahamas',
		da: 'Bahamas',
		sq: 'Bahamas',
		pt: 'Bahamas',
		tr: 'Bahamalar',
		fa: 'باهاما',
		uk: 'Багамські Острови',
		// display-only — these three interface languages have no recordings
		el: 'Μπαχάμες',
		th: 'บาฮามาส',
		zh: '巴哈马',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇧🇸',
}
