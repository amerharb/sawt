import { Digit } from './Digit'

export const d17: Digit = {
	code: '17',
	value: 17,
	name: {
		en: 'seventeen',
		ar: 'سبعة عشر',
		de: 'siebzehn',
		sv: 'sjutton',
		fr: 'dix-sept',
		tr: 'on yedi',
		fa: 'هفده',
		ru: 'семнадцать',
		fi: 'seitsemäntoista',
		es: 'diecisiete',
		he: 'שבע עשרה',
		el: 'δεκαεπτά',
	},
	// beta until every language has its recording: the five above fifteen are
	// being recorded one language at a time, and a digit the chosen language
	// cannot say would be a silent card in front of a child
	beta: true,
}
