import { Country } from './Country'

export const pr: Country = {
	code: 'pr',
	name: {
		en: 'Puerto Rico',
		ar: 'بورتوريكو',
		de: 'Puerto Rico',
		sv: 'Puerto Rico',
		da: 'Puerto Rico',
		sq: 'Portorikoja',
		pt: 'Porto Rico',
		tr: 'Porto Riko',
		fa: 'پورتوریکو',
		uk: 'Пуерто-Рико',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇵🇷',
}
