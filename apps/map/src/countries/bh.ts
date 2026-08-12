import { Country } from './Country'

export const bh: Country = {
	code: 'bh',
	name: {
		en: 'Bahrain',
		ar: 'البحرين',
		de: 'Bahrain',
		sv: 'Bahrain',
		da: 'Bahrain',
		sq: 'Bahreini',
		pt: 'Barém',
		tr: 'Bahreyn',
		fa: 'بحرین',
		uk: 'Бахрейн',
		// display-only — these three interface languages have no recordings
		el: 'Μπαχρέιν',
		th: 'บาห์เรน',
		zh: '巴林',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇧🇭',
}
