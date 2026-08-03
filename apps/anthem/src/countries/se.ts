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
		intro: 7.42,
		score: {
			// Bb major; the source has no MELODY track, so the melody is its
			// monophonic trumpet line (Software Toolworks World Atlas, 1991)
			tempo: 65,
			melody:
				'D5/0.5 D5/1 Bb4/0.5 Bb4/0.5 Bb4/1 C5/0.5 D5/0.5 D5/1 ' +
				'C5/0.5 Bb4/0.5 A4/1.5 C5/0.5 C5/1 A4/0.5 Bb4/0.5 C5/0.5 ' +
				'A4/0.5 D5/0.75 Bb4/0.25 G4/2 F4/1.5 F4/0.5 Bb4/1 Bb4/0.5 ' +
				'C5/0.5 A4/1 A4/0.5 Bb4/0.5 G4/0.75 F4/0.25 G4/0.5 A4/0.5 ' +
				'F4/1.5 F4/0.5 Bb4/0.75 A4/0.25 Bb4/0.5 C5/0.5 D5/0.5 Bb4/0.5 ' +
				'Eb5/0.75 D5/0.25 C5/2 Bb4/1.5 F4/0.5 Bb4/0.75 A4/0.25 Bb4/0.5 ' +
				'C5/0.5 D5/0.5 Bb4/0.5 Eb5/0.75 D5/0.25 C5/2 Bb4/2',
		},
		composed: '1844',
		// never formally adopted — Sweden's anthem is de facto, by tradition
	},
}
