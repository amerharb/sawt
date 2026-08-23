import { Country } from './Country'

export const hk: Country = {
	code: 'hk',
	name: {
		en: 'Hong Kong',
		ar: 'هونغ كونغ',
		de: 'Hongkong',
		sv: 'Hongkong',
		da: 'Hongkong',
		sq: 'Hong Kongu',
		pt: 'Hong Kong',
		tr: 'Hong Kong',
		fa: 'هنگ‌کنگ',
		uk: 'Гонконг',
		// display-only — these three interface languages have no recordings
		el: 'Χονγκ Κονγκ',
		th: 'ฮ่องกง',
		zh: '香港',
	},
	// recorded in English and German only so far — in any other hearing
	// language this entry steps aside instead of clicking silently
	sounds: ['en', 'de'],
	// a special administrative region of China, not a sovereign state.
	// Too small to see at world scale, so on the map it is a dot
	flag: '🇭🇰',
}
