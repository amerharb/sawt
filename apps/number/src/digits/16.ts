import { Digit } from './Digit'

export const d16: Digit = {
	code: '16',
	value: 16,
	name: {
		en: 'sixteen',
		ar: 'ستة عشر',
		de: 'sechzehn',
		sv: 'sexton',
		fr: 'seize',
		tr: 'on altı',
		fa: 'شانزده',
		ru: 'шестнадцать',
		fi: 'kuusitoista',
		es: 'dieciséis',
		he: 'שש עשרה',
		el: 'δεκαέξι',
	},
	// beta until every language has its recording: the five above fifteen are
	// being recorded one language at a time, and a digit the chosen language
	// cannot say would be a silent card in front of a child
	beta: true,
}
