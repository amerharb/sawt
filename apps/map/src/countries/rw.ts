import { Country } from './Country'

export const rw: Country = {
	code: 'rw',
	name: {
		en: 'Rwanda',
		ar: 'رواندا',
		de: 'Ruanda',
		sv: 'Rwanda',
		da: 'Rwanda',
		sq: 'Ruanda',
		pt: 'Ruanda',
		tr: 'Ruanda',
		fa: 'رواندا',
		uk: 'Руанда',
		// display-only — these three interface languages have no recordings
		el: 'Ρουάντα',
		th: 'รวันดา',
		zh: '卢旺达',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇷🇼',
}
