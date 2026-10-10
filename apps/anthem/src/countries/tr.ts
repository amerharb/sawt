import { Country } from './Country'

export const tr: Country = {
	code: 'tr',
	name: {
		en: 'Turkey',
		ar: 'تركيا',
		de: 'Türkei',
		el: 'Τουρκία',
		sv: 'Turkiet',
		th: 'ตุรกี',
		tr: 'Türkiye',
		zh: '土耳其',
	},
	flag: '🇹🇷',
	nativeLanguage: 'tr',
	anthem: {
		nativeName: 'İstiklal Marşı',
		name: {
			en: 'The Independence March',
			ar: 'نشيد الاستقلال',
		},
		// 0.52 s earlier than it used to read: 0.38.0 cut that much dead air
		// off the head of the recording
		instrument: {
			hash: '020b5ee02699',
			intro: 4.81,
			introType: 'fanfare',
		},
		score: {
			// F minor; melody from the MIDI's MELODY track (Software Toolworks World
			// Atlas, 1991 — the anthem dates from 1921)
			tempo: 112,
			key: 'F minor',
			hash: 'b83d71364ee5',
		},
		composed: '1930',
		adopted: '1921-03-12',
	},
}
