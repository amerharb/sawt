import { Country } from './Country'

export const tt: Country = {
	code: 'tt',
	name: {
		en: 'Trinidad and Tobago',
		ar: 'ترينيداد وتوباغو',
		de: 'Trinidad und Tobago',
		sv: 'Trinidad och Tobago',
		da: 'Trinidad og Tobago',
		sq: 'Trinidad dhe Tobago',
		pt: 'Trindade e Tobago',
		tr: 'Trinidad ve Tobago',
		fa: 'ترینیداد و توباگو',
		uk: 'Тринідад і Тобаго',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇹🇹',
}
