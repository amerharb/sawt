import { Country } from './Country'

export const xc: Country = {
	code: 'xc',
	name: {
		en: 'Northern Cyprus',
		ar: 'قبرص الشمالية',
		de: 'Nordzypern',
		sv: 'Norra Cypern',
		da: 'Nordcypern',
		sq: 'Qiproja e Veriut',
		pt: 'Chipre do Norte',
		tr: 'Kuzey Kıbrıs',
		fa: 'قبرس شمالی',
		uk: 'Північний Кіпр',
		// display-only — these three interface languages have no recordings
		el: 'Βόρεια Κύπρος',
		th: 'ไซปรัสเหนือ',
		zh: '北塞浦路斯',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	// no ISO code and no de-facto one either (unlike Kosovo's xk): `xc` is
	// this project's own user-assigned code, and the flag glyph is hand-drawn
	// in flags.woff2 — there is no emoji for it anywhere
	flag: '🇽🇨',
}
