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
		instrument: {
			hash: '6bf17ef78013',
			intro: 0,
		},
		score: {
			// melody from the MIDI's MELODY track (Software Toolworks World Atlas,
			// 1991), transposed down an octave — the source sits in the piccolo
			// register (F5–F6), too shrill for the synth
			tempo: 99,
			key: 'F major',
			hash: 'b653ebe14683',
		},
		composed: '1828',
		adopted: '1865',
	},
}
