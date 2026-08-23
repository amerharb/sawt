import { Country } from './Country'

export const lu: Country = {
	code: 'lu',
	name: {
		en: 'Luxembourg',
		ar: 'لوكسمبورغ',
		de: 'Luxemburg',
		el: 'Λουξεμβούργο',
		sv: 'Luxemburg',
		th: 'ลักเซมเบิร์ก',
		tr: 'Lüksemburg',
		zh: '卢森堡',
	},
	flag: '🇱🇺',
	nativeLanguage: 'lb',
	anthem: {
		nativeName: 'Ons Heemecht',
		name: {
			en: 'Our Homeland',
		},
		// Lentz died 1893, so the words are public domain. The first and the
		// fourth stanza — the two the law of 27 July 1993 names — as sung,
		// each closing with its repeated couplet; see tools/fetch-lyrics.py
		lyrics: ['lb'],
		// no intro — the recording starts the tune at once. Its one internal
		// silence (48.5s) is a strain boundary: the band plays the full
		// 80-beat tune, breathes, and repeats its last 54 beats.
		score: {
			// B♭ major, 80 beats. From the World Atlas MIDI's dedicated Melody
			// track — 73 notes, polyphony 1, the first source since Denmark's
			// needing no extraction at all. Arranged in E♭ and moved down a
			// fourth to the recording's key, which was measured from
			// fundamentals: B♭ major covers 100% of them, and all 73 notes
			// land diatonic, closing on the tonic.
			//
			// Tempo confirmed twice over: the tune's 80 beats across the
			// recording's 48.5-second first strain give 98.8, and the 54-beat
			// repeat across its 32.7 seconds gives 99.0.
			tempo: 99,
			melody:
				'F4/1 F4/1.5 Bb4/0.5 Bb4/1 D4/1 F4/1 Eb4/1 Eb4/1.5 Eb4/0.5 Eb4/1 ' +
				'F4/0.5 G4/0.5 F4/1.5 Eb4/0.5 D4/2 r/1 F4/1 F4/1.5 Bb4/0.5 Bb4/1.5 ' +
				'A4/0.5 G4/1 G4/1 C5/1.5 Bb4/0.5 A4/1 F4/1 A4/1.5 G4/0.5 F4/3 C4/1 ' +
				'C4/1.5 D4/0.5 Eb4/1 F4/1 G4/1 G4/1 F4/1.5 Eb4/0.5 D4/1 F4/1 F4/1 ' +
				'Bb4/1 A4/3 F4/1 F4/1 G4/0.5 A4/0.5 Bb4/1 C5/1 D5/1.5 C5/0.5 Bb4/1 ' +
				'G4/1 F4/1.5 D4/0.5 F4/1 Eb4/1 D4/3 F4/1 F4/1 G4/0.5 A4/0.5 Bb4/1 ' +
				'C5/1 D5/1.5 C5/0.5 Bb4/1 G4/1 F4/1.5 Bb4/0.5 A4/1 C5/1 Bb4/3',
		},
		composed: '1864',
		adopted: '1895',
	},
}
