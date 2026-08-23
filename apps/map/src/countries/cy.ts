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
		// display-only — these three interface languages have no recordings
		el: 'Κύπρος',
		th: 'ไซปรัส',
		zh: '塞浦路斯',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇨🇾',
}
