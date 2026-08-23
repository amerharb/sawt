import { Country } from './Country'

export const mc: Country = {
	code: 'mc',
	name: {
		en: 'Monaco',
		ar: 'موناكو',
		de: 'Monaco',
		sv: 'Monaco',
		da: 'Monaco',
		sq: 'Monako',
		pt: 'Mónaco',
		tr: 'Monako',
		fa: 'موناکو',
		uk: 'Монако',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇲🇨',
}
