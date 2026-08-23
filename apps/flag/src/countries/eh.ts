import { Country } from './Country'

export const eh: Country = {
	code: 'eh',
	name: {
		en: 'Western Sahara',
		ar: 'الصحراء الغربية',
		de: 'Westsahara',
		sv: 'Västsahara',
		da: 'Vestsahara',
		sq: 'Sahara Perëndimore',
		pt: 'Saara Ocidental',
		tr: 'Batı Sahra',
		fa: 'صحرای غربی',
		uk: 'Західна Сахара',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇪🇭',
}
