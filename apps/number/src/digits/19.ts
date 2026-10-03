import { Digit } from './Digit'

export const d19: Digit = {
	code: '19',
	value: 19,
	name: {
		en: 'nineteen',
		ar: 'تسعة عشر',
		de: 'neunzehn',
		sv: 'nitton',
		fr: 'dix-neuf',
		tr: 'on dokuz',
		fa: 'نوزده',
		ru: 'девятнадцать',
		fi: 'yhdeksäntoista',
		es: 'diecinueve',
		he: 'תשע עשרה',
		el: 'δεκαεννέα',
	},
	// beta until every language has its recording: the five above fifteen are
	// being recorded one language at a time, and a digit the chosen language
	// cannot say would be a silent card in front of a child
	beta: true,
}
