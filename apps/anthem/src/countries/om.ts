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
			// predates that revision — worth checking against a current recording
			tempo: 116,
			key: 'Bb major',
			hash: 'cb4a6bd5704e',
		},
		composed: '1932',
		adopted: '1970-07-23',
	},
}
