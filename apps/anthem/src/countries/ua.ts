import { Country } from './Country'

export const ua: Country = {
	code: 'ua',
	name: {
		en: 'Ukraine',
		ar: 'أوكرانيا',
		de: 'Ukraine',
		el: 'Ουκρανία',
		sv: 'Ukraina',
		th: 'ยูเครน',
		tr: 'Ukrayna',
		zh: '乌克兰',
	},
	flag: '🇺🇦',
	nativeLanguage: 'uk',
	anthem: {
		nativeName: 'Ще не вмерла України і слава, і воля',
		name: {
			en: "Ukraine's Glory and Freedom Has Not Yet Perished",
		},
		// the 2003 text: Chubynsky's first stanza, one grammatical ending
		// changed by the law that adopted it, and the two-line refrain
		lyrics: ['uk'],
		// no intro: the US Navy Band is at full level by 0.1 s, with no fanfare
		// in front of the tune and no silence in front of that
		score: {
			// G minor, 129 beats. From the CC0 MIDI on Commons (midi/README.md),
			// sequenced by Peter Gerloff and written in E minor; its trumpet line
			// carries the melody alone, 130 notes with no overlap anywhere, so
			// there was nothing to disentangle. Three semitones up to the band,
			// which is not a guess: the MIDI comes to rest on E and the recording
			// on G. The second source in this project that could simply be
			// committed — Verbytsky died in 1870 — the Vatican's being the first.
			//
			// 104 is the band's own pace, 129 beats over its 74.4 s, chosen by ear
			// over the 97 the sequencer wrote; 🎼 and 🎺 therefore run together.
			tempo: 104,
			melody:
				'D5/1.5 D5/0.5 D5/0.5 C5/0.5 D5/0.5 Eb5/0.5 F5/1.5 Eb5/0.5 D5/1 ' +
				'C5/1 Bb4/2 Bb4/1 D5/1 G4/1 A4/1 Bb4/1 C5/1 D5/1.5 D5/0.5 D5/0.5 ' +
				'C5/0.5 D5/0.5 Eb5/0.5 F5/1.5 Eb5/0.5 D5/1 C5/1 Bb4/2 D5/1 F#4/1 ' +
				'G4/2 G4/2 D5/1.5 A4/0.5 D5/0.5 C5/0.5 Bb4/0.5 A4/0.5 G4/1 Bb4/1 ' +
				'A4/2 Bb4/1 Bb4/1 C5/1 C5/1 D5/2 Bb4/2 D5/1.5 A4/0.5 D5/0.5 ' +
				'C5/0.5 Bb4/0.5 A4/0.5 G4/1 Bb4/1 A4/2 Bb4/1 G4/1 D5/1 F#4/1 ' +
				'G4/1.5 A4/0.5 Bb4/0.5 C5/0.5 D5/0.5 Eb5/0.5 F5/1.5 E5/0.5 F5/1 ' +
				'D5/1 C5/1 C5/1 F5/0.5 Eb5/0.5 D5/0.5 C5/0.5 Bb4/1 Bb4/1 C5/1 ' +
				'C5/1 D5/1.5 C5/0.5 Bb4/0.5 C5/0.5 D5/0.5 Eb5/0.5 F5/1.5 E5/0.5 ' +
				'F5/1 D5/1 C5/1 C5/1 F5/0.5 Eb5/0.5 D5/0.5 C5/0.5 Bb4/1 Bb4/1 ' +
				'A4/1 A4/1 G4/2 G4/1 Bb4/1 A4/2 D5/1.5 C5/0.5 Bb4/1 Bb4/1 A4/1 ' +
				'A4/1 Bb4/1 Bb4/1 C5/1 C5/1 D5/2 C5/1 Bb4/1 A4/2 D5/1.5 C5/0.5 ' +
				'Bb4/1 Bb4/1 C5/1 C5/1 Bb4/1 G4/1 D5/1 F#4/1 G4/2.5 G4/2.5',
		},
		// Verbytsky set Chubynsky's poem in 1863; the music became the anthem in
		// 1992 and the words waited eleven more years for a law of their own
		composed: '1863',
		adopted: '2003-03-06',
	},
}
