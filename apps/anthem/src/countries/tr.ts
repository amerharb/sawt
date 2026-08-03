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
		intro: 5.33,
		score: {
			// F minor; melody from the MIDI's MELODY track (Software Toolworks World
			// Atlas, 1991 — the anthem dates from 1921)
			tempo: 112,
			melody:
				'C4/1 F4/1 G4/1 Ab4/1 E4/0.75 G4/0.25 F4/2.5 r/0.5 ' +
				'F4/1 Bb4/1 C5/1 Db5/0.75 C5/0.25 A4/0.75 C5/0.25 Bb4/2.5 ' +
				'r/0.5 C5/0.25 B4/0.25 C5/0.25 G4/1 G4/1.75 Bb4/0.25 Ab4/0.75 ' +
				'E4/0.25 F4/0.75 G4/0.25 Ab4/0.75 Bb4/0.25 C5/0.75 Db5/0.25 Eb5/0.75 ' +
				'F5/0.25 Eb5/1 Eb4/0.25 D4/0.25 Eb4/0.25 C5/1 Bb4/1 Ab4/2.5 ' +
				'r/0.5 C4/0.25 B3/0.25 C4/0.25 G4/1 C4/1 C5/0.75 Bb4/0.25 ' +
				'Ab4/0.25 G4/0.25 Ab4/0.25 F4/1 F5/1.75 Eb5/0.25 Db5/0.75 C5/0.25 ' +
				'Bb4/0.75 Ab4/0.25 G4/0.75 F4/0.25 C5/1 C4/1 F4/2.5 r/0.5 ' +
				'C4/1 F4/1 G4/1 Ab4/1 E4/0.75 G4/0.25 F4/2.5 r/0.5 ' +
				'F4/1 Bb4/1 C5/1 Db5/0.75 C5/0.25 A4/0.75 C5/0.25 Bb4/2.5 ' +
				'r/0.5 C5/0.25 B4/0.25 C5/0.25 G4/1 G4/1.75 Bb4/0.25 Ab4/0.75 ' +
				'E4/0.25 F4/0.75 G4/0.25 Ab4/0.75 Bb4/0.25 C5/0.75 Db5/0.25 Eb5/0.75 ' +
				'F5/0.25 Eb5/1 Eb4/0.25 D4/0.25 Eb4/0.25 C5/1 Bb4/1 Ab4/2.5 ' +
				'r/0.5 C4/0.25 B3/0.25 C4/0.25 G4/1 C4/1 C5/0.75 Bb4/0.25 ' +
				'Ab4/0.25 G4/0.25 Ab4/0.25 F4/1 F5/1.75 Eb5/0.25 Db5/0.75 C5/0.25 ' +
				'Bb4/0.75 Ab4/0.25 G4/0.75 F4/0.25 C5/1 C4/1 F4/2.5',
		},
		composed: '1930',
		adopted: '1921-03-12',
	},
}
