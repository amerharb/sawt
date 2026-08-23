import { Country } from './Country'

export const kp: Country = {
	code: 'kp',
	name: {
		en: 'North Korea',
		ar: 'كوريا الشمالية',
		de: 'Nordkorea',
		sv: 'Nordkorea',
		da: 'Nordkorea',
		sq: 'Koreja e Veriut',
		pt: 'Coreia do Norte',
		tr: 'Kuzey Kore',
		fa: 'کره شمالی',
		uk: 'Північна Корея',
		// display-only — these three interface languages have no recordings
		el: 'Βόρεια Κορέα',
		th: 'เกาหลีเหนือ',
		zh: '朝鲜',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇰🇵',
}
