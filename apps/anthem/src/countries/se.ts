import { Country } from './Country'

export const se: Country = {
	code: 'se',
	name: {
		en: 'Sweden',
		ar: 'السويد',
		de: 'Schweden',
		el: 'Σουηδία',
		sv: 'Sverige',
		th: 'สวีเดน',
		tr: 'İsveç',
		zh: '瑞典',
	},
	flag: '🇸🇪',
	nativeLanguage: 'sv',
	anthem: {
		nativeName: 'Du gamla, du fria',
		name: {
			en: 'Thou ancient, thou free',
			ar: 'أيتها القديمة، أيتها الحرة',
		},
		instrument: {
			hash: '47ec0d031433',
			intro: 7.42,
			introType: 'fanfare',
		},
		score: {
			// Bb major; the source has no MELODY track, so the melody is its
			// monophonic trumpet line (Software Toolworks World Atlas, 1991)
			tempo: 65,
			key: 'Bb major',
			hash: 'f9766f266772',
		},
		composed: '1844',
		// never formally adopted — Sweden's anthem is de facto, by tradition
	},
}
