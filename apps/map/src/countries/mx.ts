import { Country } from './Country'

export const mx: Country = {
	code: 'mx',
	name: {
		en: 'Mexico',
		ar: 'المكسيك',
		de: 'Mexiko',
		sv: 'Mexiko',
		da: 'Mexico',
		sq: 'Meksika',
		pt: 'México',
		tr: 'Meksika',
		fa: 'مکزیک',
		uk: 'Мексика',
		// display-only — these three interface languages have no recordings
		el: 'Μεξικό',
		th: 'เม็กซิโก',
		zh: '墨西哥',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇲🇽',
}
