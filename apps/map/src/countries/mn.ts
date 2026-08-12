import { Country } from './Country'

export const mn: Country = {
	code: 'mn',
	name: {
		en: 'Mongolia',
		ar: 'منغوليا',
		de: 'Mongolei',
		sv: 'Mongoliet',
		da: 'Mongoliet',
		sq: 'Mongolia',
		pt: 'Mongólia',
		tr: 'Moğolistan',
		fa: 'مغولستان',
		uk: 'Монголія',
		// display-only — these three interface languages have no recordings
		el: 'Μογγολία',
		th: 'มองโกเลีย',
		zh: '蒙古',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇲🇳',
}
