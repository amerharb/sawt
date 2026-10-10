import { Country } from './Country'

export const om: Country = {
	code: 'om',
	name: {
		en: 'Oman',
		ar: 'عُمان',
		de: 'Oman',
		el: 'Ομάν',
		sv: 'Oman',
		th: 'โอมาน',
		tr: 'Umman',
		zh: '阿曼',
	},
	flag: '🇴🇲',
	nativeLanguage: 'ar',
	anthem: {
		nativeName: 'السلام السلطاني',
		name: {
			en: 'The Sultanic Salutation',
			ar: 'السلام السلطاني',
		},
		instrument: {
			hash: 'c459f7a40b5f',
			intro: 27.43,
			introType: 'prelude',
		},
		score: {
			// Bb major; melody from the MIDI's MELODY track (Software Toolworks
			// World Atlas, 1991). NOTE: Oman revised its anthem in 1996, so this
			// predates that revision — worth checking against a current recording.
			// Its first 32 beats are the anthem's own fanfare intro, the calls that
			// end on B♭ and a rest before the tune starts again from its F4 pickup;
			// the empty line in the melody file falls there. Tempo 66, chosen by
			// ear from 62, 64 and 66: the MIDI's 116 is twice the band's pace — intro
			// and tune both fit far better near half of it — and the band's lengths
			// put it between 58 and 70.
			tempo: 66,
			key: 'Bb major',
			hash: '2983871ac790',
			introType: 'fanfare',
		},
		composed: '1932',
		adopted: '1970-07-23',
	},
}
