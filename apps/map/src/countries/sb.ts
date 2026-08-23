import { Country } from './Country'

export const sb: Country = {
	code: 'sb',
	name: {
		en: 'Solomon Islands',
		ar: 'جزر سليمان',
		de: 'Salomonen',
		sv: 'Salomonöarna',
		da: 'Salomonøerne',
		sq: 'Ishujt Solomon',
		pt: 'Ilhas Salomão',
		tr: 'Solomon Adaları',
		fa: 'جزایر سلیمان',
		uk: 'Соломонові Острови',
		// display-only — these three interface languages have no recordings
		el: 'Νησιά Σολομώντα',
		th: 'หมู่เกาะโซโลมอน',
		zh: '所罗门群岛',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇸🇧',
}
