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
		// display-only — these three interface languages have no recordings
		el: 'Δυτική Σαχάρα',
		th: 'เวสเทิร์นสะฮารา',
		zh: '西撒哈拉',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇪🇭',
}
