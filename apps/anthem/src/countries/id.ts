import { Country } from './Country'

export const id: Country = {
	code: 'id',
	name: {
		en: 'Indonesia',
		ar: 'إندونيسيا',
		de: 'Indonesien',
		el: 'Ινδονησία',
		sv: 'Indonesien',
		th: 'อินโดนีเซีย',
		tr: 'Endonezya',
		zh: '印度尼西亚',
	},
	flag: '🇮🇩',
	nativeLanguage: 'id',
	anthem: {
		nativeName: 'Indonesia Raya',
		name: {
			en: 'Indonesia the Great',
		},
		// Stanza I and the refrain, which is what the recordings sing — the other
		// two stanzas belong to the three-stanza cuts. Supratman wrote both words
		// and music and died in 1938, so one death year settles the whole anthem;
		// the modern spelling here is a state committee's revision of his text,
		// which is the ground Australia's and Canada's words already stand on.
		lyrics: ['id'],
		/*
		 * A real intro, and the reason this recording was chosen over the band
		 * ones: the orchestra plays 5.26 s before the tune. Measured twice over —
		 * the level falls to −30 dB there, its lowest point between 3.8 and 6.2 s,
		 * and the score locks to the recording from 5.29 s. The wind-band and
		 * unison cuts of the same set open straight on the tune and would have
		 * given 🎺 and 🎼 alone; with this one Indonesia gets all four renderings.
		 *
		 * Both files were trimmed before encoding — 0.22 s of digital silence off
		 * the head and 1.95 s off the tail, which is why this number is 0.22 less
		 * than the same boundary in the file on Commons.
		 */
		instrument: {
			hash: '6a195a1f666a',
			intro: 5.26,
			introType: 'fanfare',
		},
		score: {
			/*
			 * G major, 40 bars of 4/4 after a quarter-note anacrusis, 160 beats —
			 * one stanza and the refrain twice, exactly what the recording plays.
			 * From the LilyPond block on id.wikipedia, itself set from the
			 * government songbook *Brosur Lagu Kebangsaan — Indonesia Raya*, p. 153.
			 *
			 * **The first score here needing neither transposition nor an adjusted
			 * tempo.** Everywhere else the written key has had to be moved to meet
			 * the recording and the tempo fitted to its length; this one is already
			 * in G, and ♩=96 is both the score's own marking and what all three
			 * government recordings measure, to 96.00.
			 *
			 * The key was still checked from fundamentals rather than taken on
			 * trust: of the eleven notes held two beats or more, three come back at
			 * exactly 0 semitones and every one of the rest lands on an octave,
			 * fifth or third of the G triad, which is what an orchestra's loudest
			 * partial does on a sustained chord. The parse has its own check too —
			 * it comes to 160.0 beats, exactly 40 bars, and every note is diatonic
			 * in G.
			 */
			// The melody file opens with the band's intro, which is the tune's own
			// closing phrase, "Hiduplah Indonesia Raya", at the tune's pace — every
			// note within 21 ms of the band's — before the empty line.
			tempo: 96,
			key: 'G major',
			hash: '80fa7eb70f4e',
			introType: 'fanfare',
		},
		choral: {
			hash: 'b29ab1e05222',
			intro: 0,
		},
		// Composed in 1924 and first played in public at the Youth Congress of
		// 28 October 1928. It became the anthem with independence in 1945; the
		// arrangement every recording here uses is Jos Cleber's of 1951.
		composed: '1924',
		adopted: '1945-08-17',
	},
}
