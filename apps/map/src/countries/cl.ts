import { Country } from './Country'

export const cl: Country = {
	code: 'cl',
	name: {
		en: 'Chile',
		ar: 'تشيلي',
		de: 'Chile',
		sv: 'Chile',
		da: 'Chile',
		sq: 'Kili',
		pt: 'Chile',
		tr: 'Şili',
		fa: 'شیلی',
		uk: 'Чилі',
		// display-only — these three interface languages have no recordings
		el: 'Χιλή',
		th: 'ชิลี',
		zh: '智利',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇨🇱',
}
