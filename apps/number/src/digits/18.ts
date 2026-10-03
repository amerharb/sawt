import { Digit } from './Digit'

export const d18: Digit = {
	code: '18',
	value: 18,
	name: {
		en: 'eighteen',
		ar: 'ثمانية عشر',
		de: 'achtzehn',
		sv: 'arton',
		fr: 'dix-huit',
		tr: 'on sekiz',
		fa: 'هجده',
		ru: 'восемнадцать',
		fi: 'kahdeksantoista',
		es: 'dieciocho',
		he: 'שמונה עשרה',
		el: 'δεκαοκτώ',
	},
	// beta until every language has its recording: the five above fifteen are
	// being recorded one language at a time, and a digit the chosen language
	// cannot say would be a silent card in front of a child
	beta: true,
}
