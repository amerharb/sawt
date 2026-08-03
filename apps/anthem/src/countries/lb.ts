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
		intro: 17,
		score: {
			// G major; melody from the MIDI's MELODY track (Software Toolworks
			// World Atlas, 1991 — Lebanon's anthem is unchanged since 1927)
			tempo: 110,
			melody:
				'D4/0.75 D4/0.25 G4/3 A4/0.75 A4/0.25 B4/1 D4/0.75 D4/0.25 ' +
				'E4/1 F#4/0.75 F#4/0.25 G4/1 r/2 D4/0.75 D4/0.25 G4/3 ' +
				'A4/0.75 A4/0.25 B4/1 D5/0.75 C5/0.25 B4/1 A4/0.75 A4/0.25 ' +
				'G4/1 r/2 B4/0.75 C5/0.25 D5/1 D5/0.75 D5/0.25 D5/0.5 ' +
				'C5/0.5 B4/0.75 C5/0.25 D5/1 D5/0.75 D5/0.25 D5/1 C5/0.75 ' +
				'B4/0.25 A4/1 A4/0.75 A4/0.25 A4/0.5 G4/0.5 F#4/0.75 G4/0.25 ' +
				'A4/1 A4/0.75 A4/0.25 A4/1 D4/0.75 D4/0.25 B4/1 B4/0.75 ' +
				'B4/0.25 B4/1 G4/0.75 D4/0.25 E4/1 E4/0.75 E4/0.25 E4/1 ' +
				'C5/0.75 A4/0.25 D5/3 F#4/0.75 F#4/0.25 G4/3',
		},
		composed: '1925',
		adopted: '1927-07-12',
	},
}
