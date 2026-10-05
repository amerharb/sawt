import { Country } from './Country'

export const fi: Country = {
	code: 'fi',
	name: {
		en: 'Finland',
		ar: 'فنلندا',
		de: 'Finnland',
		el: 'Φινλανδία',
		sv: 'Finland',
		th: 'ฟินแลนด์',
		tr: 'Finlandiya',
		zh: '芬兰',
	},
	flag: '🇫🇮',
	nativeLanguage: 'fi',
	anthem: {
		nativeName: 'Maamme',
		name: {
			en: 'Our Land',
			sv: 'Vårt land',
			de: 'Unser Land',
		},
		// Stanzas 1 and 11 of Runeberg's poem, six lines each, in both languages:
		// Cajander's Finnish (he died in 1913, reworking Julius Krohn's 1867
		// version — Krohn died in 1888) and Runeberg's Swedish original (he died in
		// 1877). Lines 3–6 of each stanza are repeated in performance; the files
		// keep the six lines once, as the pages print them. Swedish first in the
		// list would be the poem's order; Finnish first is the country's.
		lyrics: ['fi', 'sv'],
		// No intro: the band's pickup sounds at 0.1 s and nothing comes before
		// it — the level is tonal from the first frame.
		//
		// No 🎤 or 👥 either, though Commons has two sung recordings from 1929 —
		// Suomen Laulu under Heikki Klemetti (Odeon A 228022, the first recording
		// of Maamme, public domain in composition, words and performance) and an
		// unidentified Odeon O 26017 brought in from YouTube. Both are 78 rpm
		// transfers and were judged too poor to put in front of a child; the
		// first is the one to come back to if a cleaner transfer turns up.
		score: {
			/*
			 * B♭ major, 61.5 beats, 3/4 with a three-quaver pickup. The melody is
			 * the LilyPond <score> block on the Swedish and English Wikipedia
			 * articles, marked "som i trycket" — as printed — in A major, ♩ = 84,
			 * one stanza of 36 beats. See midi/README.md.
			 *
			 * **Transposed up a semitone**, measured from the recording: chroma
			 * correlation 0.49 at +1 against nothing above 0.08 at any other shift,
			 * and the held F and B♭ come back at exactly +1 from their fundamentals
			 * (the other held notes measure the root or fifth sounding under them
			 * in the bass). Wikipedia's own note on the sample says B♭ too.
			 *
			 * **The repeat is the band's, not the block's.** The sheet gives the
			 * stanza once; the band plays it, holds the last note (two beats, then
			 * a two-beat breath — the level falls to −38 dB at 27.4 s), and plays
			 * lines 3–6 again, which is how the anthem is sung. That shape fits the
			 * tape note for note: the first pass from 0.52 s at 81.25, the repeat
			 * from 28.94 s at 81.75, its last note beginning at 44.35 s and held to
			 * the end at 45.64.
			 *
			 * Tempo 84, the printed one, chosen by ear from 78, 81 and 84; the
			 * band's own pace measures 81, so 🎼 runs 43.9 s against the tape's 45.8.
			 */
			tempo: 84,
			melody:
				'F4/0.5 D4/0.5 D#4/0.5 F4/1.5 A#4/0.5 C5/0.75 F4/0.25 D5/2 A#4/1 ' +
				'G4/0.75 C5/0.25 A#4/1 A4/1 A#4/2 F4/1 C5/0.75 A#4/0.25 A4/0.5 ' +
				'G4/0.5 F4/0.5 D#4/0.5 D4/0.5 G4/0.5 F4/1 F4/1 C5/0.75 A#4/0.25 ' +
				'A4/0.5 G4/0.5 F4/0.5 D#4/0.5 D4/0.5 G4/0.5 F4/1.5 F4/0.5 A#4/0.75 ' +
				'F4/0.25 D4/0.5 F4/0.5 A#4/0.5 C5/0.5 D5/2 A#4/1 G4/0.75 C5/0.25 ' +
				'A#4/1 A4/1 A#4/2 r/2 C5/0.75 A#4/0.25 A4/0.5 G4/0.5 F4/0.5 D#4/0.5 ' +
				'D4/0.5 G4/0.5 F4/1 F4/1 C5/0.75 A#4/0.25 A4/0.5 G4/0.5 F4/0.5 ' +
				'D#4/0.5 D4/0.5 G4/0.5 F4/1.5 F4/0.5 A#4/0.75 F4/0.25 D4/0.5 F4/0.5 ' +
				'A#4/0.5 C5/0.5 D5/2 A#4/1 G4/0.75 C5/0.25 A#4/1 A4/1 A#4/2',
		},
		// Pacius set Runeberg's 1846 poem in 1848 and it was first sung on 13 May
		// that year, Flora Day, at Kumtähti field in Helsinki. No statute has ever
		// named it the anthem — like the United Kingdom's, it is one by custom — so
		// the date is the one it began to be used, not one in law.
		composed: '1848',
		adopted: '1848-05-13',
	},
}
