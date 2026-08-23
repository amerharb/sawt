import { Country } from './Country'

export const by: Country = {
	code: 'by',
	name: {
		en: 'Belarus',
		ar: 'بيلاروسيا',
		de: 'Belarus',
		sv: 'Belarus',
		da: 'Belarus',
		sq: 'Bjellorusia',
		pt: 'Bielorrússia',
		tr: 'Belarus',
		fa: 'بلاروس',
		uk: 'Білорусь',
		// display-only — these three interface languages have no recordings
		el: 'Λευκορωσία',
		th: 'เบลารุส',
		zh: '白俄罗斯',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇧🇾',
}
