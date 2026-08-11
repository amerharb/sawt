import { Country } from './Country'

export const af: Country = {
	code: 'af',
	name: {
		en: 'Afghanistan',
		ar: 'أفغانستان',
		de: 'Afghanistan',
		sv: 'Afghanistan',
		da: 'Afghanistan',
		sq: 'Afganistani',
		pt: 'Afeganistão',
		tr: 'Afganistan',
		fa: 'افغانستان',
		uk: 'Афганістан',
		// display-only — these three interface languages have no recordings
		el: 'Αφγανιστάν',
		th: 'อัฟกานิสถาน',
		zh: '阿富汗',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇦🇫',
}
