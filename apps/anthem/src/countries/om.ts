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
		intro: 27.43,
		score: {
			// Bb major; melody from the MIDI's MELODY track (Software Toolworks
			// World Atlas, 1991). NOTE: Oman revised its anthem in 1996, so this
			// predates that revision — worth checking against a current recording
			tempo: 116,
			melody:
				'F4/1 Bb4/1 Bb4/0.75 Bb4/0.25 Bb4/0.75 C5/0.25 D5/0.75 Bb4/0.25 ' +
				'C5/2 r/1 F4/0.75 F4/0.25 C5/1 C5/0.75 C5/0.25 C5/0.75 ' +
				'D5/0.25 Eb5/0.75 C5/0.25 D5/2 r/1 F5/0.75 F5/0.25 F5/0.5 ' +
				'r/2.5 F5/0.75 F5/0.25 F5/0.5 r/2.5 F5/0.75 F5/0.25 F5/1 ' +
				'C5/0.75 D5/0.25 Eb5/1 D5/0.75 C5/0.25 Bb4/1 Bb4/0.75 Bb4/0.25 ' +
				'Bb4/0.5 r/0.5 F4/1 Bb4/1 Bb4/1 C5/1 C5/1 D5/1.5 ' +
				'C5/0.5 Bb4/1 D5/1 C5/1 Bb4/1 C5/1 A4/1 Bb4/1 ' +
				'Bb4/0.75 Bb4/0.25 Bb4/1 Bb4/0.75 C5/0.25 D5/1.5 D5/0.5 C5/1 ' +
				'Bb4/1 C5/1 C5/1 r/1 C5/0.75 D5/0.25 Eb5/1.5 Eb5/0.5 ' +
				'D5/1 C5/1 D5/0.75 r/2 F5/0.75 F5/0.25 F5/1 r/2 ' +
				'F5/0.75 F5/0.25 F5/1 r/2 C5/0.75 D5/0.25 Eb5/1.5 Eb5/0.5 ' +
				'D5/1 C5/1 D5/3 F5/0.75 F5/0.25 F5/1 r/2 F5/0.75 ' +
				'F5/0.25 F5/1 r/2 C5/0.75 D5/0.25 Eb5/1.5 Eb5/0.5 D5/1 ' +
				'C5/1 Bb4/2.5',
		},
		composed: '1932',
		adopted: '1970-07-23',
	},
}
