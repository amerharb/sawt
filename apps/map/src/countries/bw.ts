import { Country } from './Country'

export const bw: Country = {
	code: 'bw',
	name: {
		en: 'Botswana',
		ar: 'بوتسوانا',
		de: 'Botswana',
		sv: 'Botswana',
		da: 'Botswana',
		sq: 'Botsvana',
		pt: 'Botsuana',
		tr: 'Botsvana',
		fa: 'بوتسوانا',
		uk: 'Ботсвана',
		// display-only — these three interface languages have no recordings
		el: 'Μποτσουάνα',
		th: 'บอตสวานา',
		zh: '博茨瓦纳',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇧🇼',
}
