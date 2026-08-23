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
		// display-only — these three interface languages have no recordings
		el: 'Τρινιντάντ και Τομπάγκο',
		th: 'ตรินิแดดและโตเบโก',
		zh: '特立尼达和多巴哥',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇹🇹',
}
