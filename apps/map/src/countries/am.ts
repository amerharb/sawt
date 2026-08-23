import { Country } from './Country'

export const am: Country = {
	code: 'am',
	name: {
		en: 'Armenia',
		ar: 'أرمينيا',
		de: 'Armenien',
		sv: 'Armenien',
		da: 'Armenien',
		sq: 'Armenia',
		pt: 'Arménia',
		tr: 'Ermenistan',
		fa: 'ارمنستان',
		uk: 'Вірменія',
		// display-only — these three interface languages have no recordings
		el: 'Αρμενία',
		th: 'อาร์เมเนีย',
		zh: '亚美尼亚',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇦🇲',
}
