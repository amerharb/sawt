import { Country } from './Country'

export const ph: Country = {
	code: 'ph',
	name: {
		en: 'Philippines',
		ar: 'الفلبين',
		de: 'Philippinen',
		sv: 'Filippinerna',
		da: 'Filippinerne',
		sq: 'Filipinet',
		pt: 'Filipinas',
		tr: 'Filipinler',
		fa: 'فیلیپین',
		uk: 'Філіппіни',
		// display-only — these three interface languages have no recordings
		el: 'Φιλιππίνες',
		th: 'ฟิลิปปินส์',
		zh: '菲律宾',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇵🇭',
}
