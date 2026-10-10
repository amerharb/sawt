import { Country } from './Country'

export const sy: Country = {
	code: 'sy',
	name: {
		en: 'Syria',
		ar: 'سوريا',
		de: 'Syrien',
		el: 'Συρία',
		sv: 'Syrien',
		th: 'ซีเรีย',
		tr: 'Suriye',
		zh: '叙利亚',
	},
	flag: '🇸🇾',
	nativeLanguage: 'ar',
	anthem: {
		nativeName: 'حماة الديار',
		name: {
			en: 'Guardians of the Homeland',
			ar: 'حماة الديار',
		},
		instrument: {
			hash: '4fbcfcdd8452',
			intro: 0,
		},
		score: {
			// A major, 4/4, quarter = 100 per the published score (Mohammad and
			// Ahmad Salim Flayfel); melody taken from the MIDI's MELODY track
			tempo: 100,
			key: 'A major',
			hash: '558f8ab43082',
		},
		composed: '1936',
		adopted: '1938',
	},
}
