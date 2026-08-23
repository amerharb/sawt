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
		// display-only — these three interface languages have no recordings
		el: 'Νησιά Μάρσαλ',
		th: 'หมู่เกาะมาร์แชลล์',
		zh: '马绍尔群岛',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇲🇭',
}
