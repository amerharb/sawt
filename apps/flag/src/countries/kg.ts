import { Country } from './Country'

export const kg: Country = {
	code: 'kg',
	name: {
		en: 'Kyrgyzstan',
		ar: 'قيرغيزستان',
		de: 'Kirgisistan',
		sv: 'Kirgizistan',
		da: 'Kirgisistan',
		sq: 'Kirgistani',
		pt: 'Quirguistão',
		tr: 'Kırgızistan',
		fa: 'قرقیزستان',
		uk: 'Киргизстан',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇰🇬',
}
