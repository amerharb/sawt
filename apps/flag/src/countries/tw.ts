import { Country } from './Country'

export const tw: Country = {
	code: 'tw',
	name: {
		en: 'Taiwan',
		ar: 'تايوان',
		de: 'Taiwan',
		sv: 'Taiwan',
		da: 'Taiwan',
		sq: 'Tajvani',
		pt: 'Taiwan',
		tr: 'Tayvan',
		fa: 'تایوان',
		uk: 'Тайвань',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇹🇼',
}
