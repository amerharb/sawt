import { Country } from './Country'

export const th: Country = {
	code: 'th',
	name: {
		en: 'Thailand',
		ar: 'تايلاند',
		de: 'Thailand',
		el: 'Ταϊλάνδη',
		sv: 'Thailand',
		th: 'ประเทศไทย',
		tr: 'Tayland',
		zh: '泰国',
	},
	flag: '🇹🇭',
	nativeLanguage: 'th',
	anthem: {
		nativeName: 'เพลงชาติไทย',
		name: {
			en: 'Thai National Anthem',
			ar: 'النشيد الوطني التايلاندي',
		},
		score: {
			// C major; melody from the MIDI's MELODY track (Software Toolworks World
			// Atlas, 1991 — Thailand's anthem is unchanged since 1939)
			tempo: 120,
			melody:
				'G3/0.25 C4/0.75 E4/0.25 G4/1 G4/0.75 G4/0.25 A4/0.75 G4/0.25 ' +
				'F4/0.75 A4/0.25 G4/2 E4/1 E4/0.75 F4/0.25 E4/0.75 D4/0.25 ' +
				'D4/1.75 D4/0.25 D4/0.75 E4/0.25 D4/0.75 C4/0.25 C4/2 C4/0.75 ' +
				'E4/0.25 G4/1 G4/1 A4/0.75 G4/0.25 F4/0.75 A4/0.25 G4/3 ' +
				'G4/0.75 A4/0.25 B4/0.75 G4/0.25 D5/1.75 D4/0.25 A4/0.75 B4/0.25 ' +
				'A4/2 G4/0.5 r/0.5 G4/0.75 A4/0.25 G4/0.5 F4/0.5 D4/2 ' +
				'F4/0.75 A4/0.25 G4/0.5 E4/0.5 C4/2 C4/0.75 E4/0.25 D4/1 ' +
				'D4/0.75 D4/0.25 A4/1 B4/0.75 A4/0.25 G4/2.5 C4/0.25 C4/0.75 ' +
				'E4/0.25 G4/1 G4/1 A4/0.75 B4/0.25 C5/0.75 D5/0.25 E5/2.5 ' +
				'D5/0.25 C5/0.75 A4/0.25 G4/0.75 A4/0.25 B4/0.75 C5/0.25 E5/0.75 ' +
				'C5/0.25 D5/0.75 C5/0.25 C5/2.5',
		},
		composed: '1932',
		adopted: '1939-12-10',
	},
}
