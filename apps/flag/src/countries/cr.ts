import { Country } from './Country'

export const cr: Country = {
	code: 'cr',
	name: {
		en: 'Costa Rica',
		ar: 'كوستاريكا',
		de: 'Costa Rica',
		sv: 'Costa Rica',
		da: 'Costa Rica',
		sq: 'Kosta Rika',
		pt: 'Costa Rica',
		tr: 'Kosta Rika',
		fa: 'کاستاریکا',
		uk: 'Коста-Рика',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇨🇷',
}
