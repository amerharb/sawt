import { Country } from './Country'

export const md: Country = {
	code: 'md',
	name: {
		en: 'Moldova',
		ar: 'مولدوفا',
		de: 'Moldau',
		sv: 'Moldavien',
		da: 'Moldova',
		sq: 'Moldavia',
		pt: 'Moldávia',
		tr: 'Moldova',
		fa: 'مولداوی',
		uk: 'Молдова',
		// display-only — these three interface languages have no recordings
		el: 'Μολδαβία',
		th: 'มอลโดวา',
		zh: '摩尔多瓦',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇲🇩',
}
