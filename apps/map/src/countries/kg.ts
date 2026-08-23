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
		// display-only — these three interface languages have no recordings
		el: 'Κιργιζία',
		th: 'คีร์กีซสถาน',
		zh: '吉尔吉斯斯坦',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇰🇬',
}
