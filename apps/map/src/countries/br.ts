import { Country } from './Country'

export const br: Country = {
	code: 'br',
	name: {
		en: 'Brazil',
		ar: 'البرازيل',
		de: 'Brasilien',
		sv: 'Brasilien',
		da: 'Brasilien',
		sq: 'Brazili',
		pt: 'Brasil',
		tr: 'Brezilya',
		fa: 'برزیل',
		uk: 'Бразилія',
		// display-only — these three interface languages have no recordings
		el: 'Βραζιλία',
		th: 'บราซิล',
		zh: '巴西',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇧🇷',
}
