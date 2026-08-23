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
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇰🇷',
}
