import { Country } from './Country'

export const cy: Country = {
	code: 'cy',
	name: {
		en: 'Cyprus',
		ar: 'قبرص',
		de: 'Zypern',
		sv: 'Cypern',
		da: 'Cypern',
		sq: 'Qipro',
		pt: 'Chipre',
		tr: 'Kıbrıs',
		fa: 'قبرس',
		uk: 'Кіпр',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇨🇾',
}
