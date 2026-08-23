import { Country } from './Country'

export const cn: Country = {
	code: 'cn',
	name: {
		en: 'China',
		ar: 'الصين',
		de: 'China',
		sv: 'Kina',
		da: 'Kina',
		sq: 'Kina',
		pt: 'China',
		tr: 'Çin',
		fa: 'چین',
		uk: 'Китай',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇨🇳',
}
