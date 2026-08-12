import { Country } from './Country'

export const bt: Country = {
	code: 'bt',
	name: {
		en: 'Bhutan',
		ar: 'بوتان',
		de: 'Bhutan',
		sv: 'Bhutan',
		da: 'Bhutan',
		sq: 'Butani',
		pt: 'Butão',
		tr: 'Butan',
		fa: 'بوتان',
		uk: 'Бутан',
		// display-only — these three interface languages have no recordings
		el: 'Μπουτάν',
		th: 'ภูฏาน',
		zh: '不丹',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇧🇹',
}
