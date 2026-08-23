import { Country } from './Country'

export const lk: Country = {
	code: 'lk',
	name: {
		en: 'Sri Lanka',
		ar: 'سريلانكا',
		de: 'Sri Lanka',
		sv: 'Sri Lanka',
		da: 'Sri Lanka',
		sq: 'Sri Lanka',
		pt: 'Sri Lanka',
		tr: 'Sri Lanka',
		fa: 'سری‌لانکا',
		uk: 'Шрі-Ланка',
		// display-only — these three interface languages have no recordings
		el: 'Σρι Λάνκα',
		th: 'ศรีลังกา',
		zh: '斯里兰卡',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇱🇰',
}
