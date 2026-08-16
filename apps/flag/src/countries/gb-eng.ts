import { Country } from './Country'

export const gbEng: Country = {
	code: 'gb-eng',
	name: {
		en: 'England',
		ar: 'إنجلترا',
		de: 'England',
		sv: 'England',
		da: 'England',
		sq: 'Anglia',
		pt: 'Inglaterra',
		tr: 'İngiltere',
		fa: 'انگلستان',
		uk: 'Англія',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	// a country of the United Kingdom, not a sovereign state: its flag is the
	// subdivision emoji (a tag sequence), not a regional-indicator pair
	flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
}
