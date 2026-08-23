import { Country } from './Country'

export const nz: Country = {
	code: 'nz',
	name: {
		en: 'New Zealand',
		ar: 'نيوزيلندا',
		de: 'Neuseeland',
		sv: 'Nya Zeeland',
		da: 'New Zealand',
		sq: 'Zelanda e Re',
		pt: 'Nova Zelândia',
		tr: 'Yeni Zelanda',
		fa: 'نیوزیلند',
		uk: 'Нова Зеландія',
		// display-only — these three interface languages have no recordings
		el: 'Νέα Ζηλανδία',
		th: 'นิวซีแลนด์',
		zh: '新西兰',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇳🇿',
}
