import { Country } from './Country'

export const mh: Country = {
	code: 'mh',
	name: {
		en: 'Marshall Islands',
		ar: 'جزر مارشال',
		de: 'Marshallinseln',
		sv: 'Marshallöarna',
		da: 'Marshalløerne',
		sq: 'Ishujt Marshall',
		pt: 'Ilhas Marshall',
		tr: 'Marshall Adaları',
		fa: 'جزایر مارشال',
		uk: 'Маршаллові Острови',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇲🇭',
}
