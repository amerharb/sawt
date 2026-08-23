import { Country } from './Country'

export const kr: Country = {
	code: 'kr',
	name: {
		en: 'South Korea',
		ar: 'كوريا الجنوبية',
		de: 'Südkorea',
		sv: 'Sydkorea',
		da: 'Sydkorea',
		sq: 'Koreja e Jugut',
		pt: 'Coreia do Sul',
		tr: 'Güney Kore',
		fa: 'کره جنوبی',
		uk: 'Південна Корея',
		// display-only — these three interface languages have no recordings
		el: 'Νότια Κορέα',
		th: 'เกาหลีใต้',
		zh: '韩国',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇰🇷',
}
