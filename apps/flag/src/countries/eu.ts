import { Country } from './Country'

export const eu: Country = {
	code: 'eu',
	name: {
		en: 'European Union',
		ar: 'الاتحاد الأوروبي',
		de: 'Europäische Union',
		sv: 'Europeiska unionen',
		da: 'Den Europæiske Union',
		sq: 'Bashkimi Evropian',
		pt: 'União Europeia',
		tr: 'Avrupa Birliği',
		fa: 'اتحادیه اروپا',
		uk: 'Європейський Союз',
	},
	// recorded in English and German only so far — in any other hearing
	// language this entry steps aside instead of clicking silently
	sounds: ['en', 'de'],
	// not a country but a union of 27, and `eu` is exceptionally reserved in
	// ISO 3166-1 rather than officially assigned. Flag-only, like the UK's
	// countries: it has no shape of its own to click on the map
	flag: '🇪🇺',
}
