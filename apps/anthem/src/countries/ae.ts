import { Country } from './Country'

export const ae: Country = {
	code: 'ae',
	name: {
		en: 'United Arab Emirates',
		ar: 'الإمارات العربية المتحدة',
		de: 'Vereinigte Arabische Emirate',
		el: 'Ηνωμένα Αραβικά Εμιράτα',
		sv: 'Förenade Arabemiraten',
		th: 'สหรัฐอาหรับเอมิเรตส์',
		tr: 'Birleşik Arap Emirlikleri',
		zh: '阿拉伯联合酋长国',
	},
	flag: '🇦🇪',
	nativeLanguage: 'ar',
	anthem: {
		nativeName: 'عيشي بلادي',
		name: {
			en: 'Long Live My Country',
			ar: 'عيشي بلادي',
		},
		instrument: {
			hash: '9d13732853d2',
			intro: 0,
		},
		score: {
			// F major; melody from the MIDI's MELODY track (Software Toolworks
			// World Atlas, 1991 — the UAE's anthem music is unchanged since 1971)
			tempo: 125,
			key: 'F major',
			hash: '7630a2019d73',
		},
		composed: '1971',
		adopted: '1971-12-02',
	},
}
