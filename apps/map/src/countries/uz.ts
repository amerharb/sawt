import { Country } from './Country'

export const uz: Country = {
	code: 'uz',
	name: {
		en: 'Uzbekistan',
		ar: 'أوزبكستان',
		de: 'Usbekistan',
		sv: 'Uzbekistan',
		da: 'Usbekistan',
		sq: 'Uzbekistani',
		pt: 'Usbequistão',
		tr: 'Özbekistan',
		fa: 'ازبکستان',
		uk: 'Узбекистан',
		// display-only — these three interface languages have no recordings
		el: 'Ουζμπεκιστάν',
		th: 'อุซเบกิสถาน',
		zh: '乌兹别克斯坦',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇺🇿',
}
