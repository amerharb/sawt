import { Digit } from './Digit'

export const d20: Digit = {
	code: '20',
	value: 20,
	name: {
		en: 'twenty',
		ar: 'عشرون',
		de: 'zwanzig',
		sv: 'tjugo',
		fr: 'vingt',
		tr: 'yirmi',
		fa: 'بیست',
		ru: 'двадцать',
		fi: 'kaksikymmentä',
		es: 'veinte',
		he: 'עשרים',
		el: 'είκοσι',
	},
	// beta until every language has its recording: the five above fifteen are
	// being recorded one language at a time, and a digit the chosen language
	// cannot say would be a silent card in front of a child
	beta: true,
}
