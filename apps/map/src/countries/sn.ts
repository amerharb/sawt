import { Country } from './Country'

export const sn: Country = {
	code: 'sn',
	name: {
		en: 'Senegal',
		ar: 'السنغال',
		de: 'Senegal',
		sv: 'Senegal',
		da: 'Senegal',
		sq: 'Senegali',
		pt: 'Senegal',
		tr: 'Senegal',
		fa: 'سنگال',
		uk: 'Сенегал',
		// display-only — these three interface languages have no recordings
		el: 'Σενεγάλη',
		th: 'เซเนกัล',
		zh: '塞内加尔',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇸🇳',
}
