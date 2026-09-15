import { Country } from './Country'

export const pl: Country = {
	code: 'pl',
	name: {
		en: 'Poland',
		ar: 'بولندا',
		de: 'Polen',
		el: 'Πολωνία',
		sv: 'Polen',
		th: 'โปแลนด์',
		tr: 'Polonya',
		zh: '波兰',
	},
	flag: '🇵🇱',
	nativeLanguage: 'pl',
	anthem: {
		nativeName: 'Mazurek Dąbrowskiego',
		name: {
			en: "Dąbrowski's Mazurka",
		},
		// the first stanza and the refrain, as sung — the poem has four
		lyrics: ['pl'],
		// no intro: the US Navy Band is into the verse at 0.1 s
		score: {
			// F major, 3/4, 24 bars — the verse once and the refrain twice, which
			// is the whole recording. Transcribed from the LilyPond block that
			// nine Wikipedia editions carry identically (midi/README.md): the one
			// melody source in this project that needed no licence argument, since
			// the tune is an anonymous 18th-century mazurka and the notation is
			// text rather than an engraving. The recording agrees on the key,
			// measured from fundamentals and ending on F.
			//
			// 116 is the score's own marking and is kept. The band is slower —
			// 72 beats over 40.2 s is 107 — so 🎼 runs three seconds shorter than
			// 🎺. That is the written mazurka against one performance of it, not
			// an error in either.
			tempo: 116,
			melody:
				'A4/0.75 Bb4/0.25 C5/1 C5/1 C5/0.75 A4/0.25 D5/0.5 C5/0.5 ' +
				'Bb4/0.5 A4/0.5 G4/0.75 G4/0.25 C5/1.5 Bb4/0.5 Bb4/1 A4/2 ' +
				'A4/0.75 Bb4/0.25 C5/1 C5/1 C5/0.75 A4/0.25 D5/0.5 C5/0.5 ' +
				'Bb4/0.5 A4/0.5 G4/0.75 G4/0.25 C5/1.5 E4/0.5 G4/1 F4/2 G4/1 ' +
				'G4/1.5 Bb4/0.5 Bb4/0.5 A4/0.5 A4/2 Bb4/0.75 Bb4/0.25 Bb4/1 ' +
				'Bb4/0.5 D5/0.5 D5/1 C5/2 A4/0.5 C5/0.5 F5/1.5 E5/0.5 E5/0.5 ' +
				'D5/0.5 D5/2 C5/0.5 C5/0.5 Bb4/1.5 E4/0.5 G4/1 F4/2 G4/1 G4/1.5 ' +
				'Bb4/0.5 Bb4/0.5 A4/0.5 A4/2 Bb4/0.75 Bb4/0.25 Bb4/1 Bb4/0.5 ' +
				'D5/0.5 D5/1 C5/2 A4/0.5 C5/0.5 F5/1.5 E5/0.5 E5/0.5 D5/0.5 D5/2 ' +
				'C5/0.5 C5/0.5 Bb4/1.5 E4/0.5 G4/1 F4/2',
		},
		// Wybicki wrote the words in Reggio Emilia in July 1797 for the Polish
		// Legions; the tune was already a mazurka by then
		composed: '1797',
		adopted: '1927-02-26',
	},
}
