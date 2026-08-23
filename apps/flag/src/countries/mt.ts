import { Country } from './Country'

export const mt: Country = {
	code: 'mt',
	name: {
		en: 'Malta',
		ar: 'مالطا',
		de: 'Malta',
		sv: 'Malta',
		da: 'Malta',
		sq: 'Malta',
		pt: 'Malta',
		tr: 'Malta',
		fa: 'مالت',
		uk: 'Мальта',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇲🇹',
}
