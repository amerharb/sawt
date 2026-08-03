import { Country } from './Country'

export const gr: Country = {
	code: 'gr',
	name: {
		en: 'Greece',
		ar: 'اليونان',
		de: 'Griechenland',
		el: 'Ελλάδα',
		sv: 'Grekland',
		th: 'กรีซ',
		tr: 'Yunanistan',
		zh: '希腊',
	},
	flag: '🇬🇷',
	nativeLanguage: 'el',
	anthem: {
		nativeName: 'Ύμνος εις την Ελευθερίαν',
		name: {
			en: 'Hymn to Liberty',
			ar: 'نشيد الحرية',
		},
		score: {
			// melody from the MIDI's MELODY track (Software Toolworks World Atlas,
			// 1991), transposed down an octave — the source sits in the piccolo
			// register (F5–F6), too shrill for the synth
			tempo: 99,
			melody:
				'A4/0.75 Bb4/0.25 C5/1.75 Bb4/0.25 A4/0.75 Bb4/0.25 C5/1 A4/1 ' +
				'Bb4/0.75 C5/0.25 D5/1.75 D5/0.25 E5/0.75 E5/0.25 F5/1.5 r/0.5 ' +
				'G4/0.75 A4/0.25 Bb4/1.75 A4/0.25 G4/0.75 A4/0.25 Bb4/1 G4/0.5 ' +
				'r/0.5 C5/0.75 C5/0.25 E5/1.75 D5/0.25 C5/0.75 Bb4/0.25 A4/1.5 ' +
				'r/0.5 A4/0.75 A4/0.25 D5/1.75 F5/0.25 E5/0.75 Db5/0.25 D5/1 ' +
				'A4/0.5 r/0.5 A4/0.75 A4/0.25 D5/1.75 F5/0.25 E5/0.75 Db5/0.25 ' +
				'D5/1.5 r/0.5 C5/0.75 C5/0.25 C5/1 E5/0.5 r/0.5 C5/0.75 ' +
				'C5/0.25 C5/1 F5/0.5 r/0.5 C5/0.75 C5/0.25 C5/1 E5/0.75 ' +
				'C5/0.25 D5/0.75 E5/0.25 F5/1.5 r/0.5 F5/0.75 E5/0.25 E5/1 ' +
				'D5/0.5 r/0.5 D5/0.75 C5/0.25 C5/1 Bb4/0.5 r/0.5 D5/0.75 ' +
				'D5/0.25 C5/1.75 A4/0.25 Bb4/0.75 G4/0.25 Bb4/1 A4/0.5 r/0.5 ' +
				'F5/0.75 E5/0.25 E5/1 D5/0.5 r/0.5 D5/0.75 C5/0.25 C5/1 ' +
				'Bb4/0.5 r/0.5 D5/0.75 D5/0.25 C5/1.75 A4/0.25 Bb4/0.75 G4/0.25 ' +
				'F4/1.5',
		},
		composed: '1828',
		adopted: '1865',
	},
}
