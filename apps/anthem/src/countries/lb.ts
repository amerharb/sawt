import { Country } from './Country'

export const lb: Country = {
	code: 'lb',
	name: {
		en: 'Lebanon',
		ar: 'لبنان',
		de: 'Libanon',
		el: 'Λίβανος',
		sv: 'Libanon',
		th: 'เลบานอน',
		tr: 'Lübnan',
		zh: '黎巴嫩',
	},
	flag: '🇱🇧',
	nativeLanguage: 'ar',
	anthem: {
		nativeName: 'كلنا للوطن',
		name: {
			en: 'All of Us, for Our Country',
			ar: 'كلنا للوطن',
		},
		instrument: {
			hash: 'e60d8eaaed9f',
			intro: 17,
			introType: 'prelude',
		},
		score: {
			// G major; melody from the MIDI's MELODY track (Software Toolworks
			// World Atlas, 1991 — Lebanon's anthem is unchanged since 1927)
			tempo: 110,
			key: 'G major',
			hash: '5c83adcd2aba',
		},
		composed: '1925',
		adopted: '1927-07-12',
	},
}
