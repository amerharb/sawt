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
		// display-only — these three interface languages have no recordings
		el: 'Ταϊβάν',
		th: 'ไต้หวัน',
		zh: '台湾',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇹🇼',
}
