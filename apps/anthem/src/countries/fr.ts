import { Country } from './Country'

export const fr: Country = {
	code: 'fr',
	name: {
		en: 'France',
		ar: 'فرنسا',
		de: 'Frankreich',
		el: 'Γαλλία',
		sv: 'Frankrike',
		th: 'ฝรั่งเศส',
		tr: 'Fransa',
		zh: '法国',
	},
	flag: '🇫🇷',
	nativeLanguage: 'fr',
	anthem: {
		nativeName: 'La Marseillaise',
		name: {
			en: 'The Marseillaise',
		},
		// Rouget de Lisle wrote both words and music and died in 1836, so nothing here
		// raises a copyright question. The file holds the first verse and the refrain,
		// which is what is sung; the article's other six verses are not the anthem.
		lyrics: ['fr'],
		// no intro — the recording opens on the tune. Its first nineteen seconds look
		// like an introduction by spectral novelty, and cutting there would leave
		// exactly the length of the previous recording, but by ear it is the anthem.
		score: {
			// A♭ major, one pass of 123.5 beats. Transcribed from a BitMidi piano
			// arrangement in G, transposed up a semitone to the US Navy Band recording.
			// That file plays the anthem twice — the opening ten notes return at 123.5
			// beats of 248 — so only the first pass is kept.
			//
			// This is the one score here that did not need a second source to trust.
			// The extraction opens Eb Eb Eb · Ab Ab Bb Bb · Eb5 — "Allons enfants de la
			// patrie" — which is predictable in advance, so matching it is real
			// confirmation rather than two files agreeing about the same mistake.
			//
			// 116 bpm is measured from the recording's own pulse by spectral flux, not
			// fitted to its length. Both this recording and the one it replaced pulse
			// at 116 despite differing in length by nineteen seconds, which is why the
			// Navy version is longer without being slower.
			tempo: 116,
			melody:
				'Eb4/0.5 Eb4/1 Eb4/0.5 Ab4/1 Ab4/1 Bb4/1 Bb4/1 Eb5/1.5 C5/0.5 ' +
				'Ab4/1 Ab4/0.5 C5/1 Ab4/0.5 F4/1 C#5/2 Bb4/1 G4/0.5 Ab4/2 r/1 ' +
				'Ab4/1 Bb4/0.5 C5/1 C5/1 C5/1 C#5/1 C5/0.5 C5/1 Bb4/1 r/1 Bb4/1 ' +
				'C5/0.5 C#5/1 C#5/1 C#5/1 Eb5/1 C#5/0.5 C5/2 r/1 Eb5/1 Eb5/0.5 ' +
				'Eb5/1 C5/1 Ab4/0.5 Eb5/1 C5/1 Ab4/0.5 Eb4/2 r/1 Eb4/0.5 Eb4/1 ' +
				'G4/0.5 Bb4/1 Bb4/1 C#5/1 Bb4/1 G4/0.5 Bb4/1 Ab4/2 Ab4/1 F4/1 ' +
				'Ab4/1 Ab4/0.5 Ab4/1 G4/1 Ab4/0.5 Bb4/3 Bb4/1 B4/1.5 B4/0.5 B4/0.5 ' +
				'B4/0.5 C#5/0.5 Eb5/0.5 Bb4/3 B4/0.5 Bb4/0.5 Ab4/1.5 Ab4/0.5 ' +
				'Ab4/0.5 B4/0.5 Bb4/0.5 Ab4/0.5 Ab4/1 G4/1 r/1 Eb5/1 Eb5/3 Eb5/0.5 ' +
				'C5/1 Ab4/0.5 Bb4/3 Eb5/1 Eb5/3 Eb5/0.5 C5/1 Ab4/0.5 Bb4/3 Eb4/1 ' +
				'Ab4/2 r/1 Bb4/1 C5/3 r/1 C#5/2 Eb5/1 F5/1 Bb4/3 F5/1 Eb5/3 C5/0.5 ' +
				'C#5/1 Bb4/0.5 Ab4/2 r/1',
		},
		composed: '1792',
		adopted: '1795',
	},
}
