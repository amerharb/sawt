import { Country } from './Country'

export const pk: Country = {
	code: 'pk',
	name: {
		en: 'Pakistan',
		ar: 'باكستان',
		de: 'Pakistan',
		el: 'Πακιστάν',
		sv: 'Pakistan',
		th: 'ปากีสถาน',
		tr: 'Pakistan',
		zh: '巴基斯坦',
	},
	flag: '🇵🇰',
	nativeLanguage: 'ur',
	anthem: {
		nativeName: 'قومی ترانہ',
		name: {
			en: 'Blessed Be the Sacred Land',
		},
		// No words on file. Chagla's music is clear — he died in 1953 — but Hafeez
		// Jalandhari's text is not: he died in 1982, so it is in copyright until
		// 2033 in Pakistan, where the term is life plus fifty, and 2053 where it is
		// life plus seventy. Same position as China. The recording is instrumental,
		// so it sidesteps the question the way China's does.
		/*
		 * The Navy Band tape opens on a three-second snare roll, quiet and rising,
		 * and the band's pickup note lands at 3.1 s: the level jumps 10 dB between
		 * 3.0 and 3.2 and the spectrum turns from noise to tone. Fitting the melody
		 * against the recording puts strain A's first note at 3.12 s independently.
		 * Chosen by ear from cuts at 3.0, 3.1 and 3.2.
		 */
		intro: 3.1,
		score: {
			/*
			 * B♭ major, 96 beats — a one-beat pickup, then 4/4. Three strains: A
			 * (stanza 1), B (stanza 2, its own tune), A′ (stanza 3, the first tune
			 * again), with a quarter rest at the end of A and of B where the band
			 * breathes. The recording goes silent for 0.3 s at both, 27.5 s and
			 * 53.0 s; those gaps are the strain boundaries, not an intro.
			 *
			 * From the Commons MIDI's `trumpet(s)` line, with the `strings (hi)`
			 * top voice an octave down filling the nine beats where the trumpet
			 * rests at the start of B — as Liberia's horn fills in for its trumpet.
			 * Rhythm checked against the 1949 piano sheet on Commons: the sequencer
			 * released its whole notes half a beat early where the sheet writes
			 * them full, and the dotted-quaver figures the sheet prints are what the
			 * file plays as a 0.65/0.35 split. Both follow the sheet here.
			 *
			 * **No transposition.** The sheet is in F, a fifth above; the MIDI is in
			 * B♭ and so is the band: five of the nine notes held 2.5 beats or more
			 * come back within 0.16 semitone of the MIDI's pitch from their
			 * fundamentals, and the four misses all land on B♭ — the root sounding
			 * in the bass under a held fifth or ninth.
			 *
			 * Tempo 75: strain A fits at 78, B at 74.8, A′ at 75.0, and 75 overall
			 * puts the score at 76.8 s against the band's 78.5 s of tune — the rest
			 * is the held final chord. Chosen by ear from 72, 75 and 78.
			 */
			tempo: 75,
			melody:
				'A#3/1 D4/0.75 D#4/0.25 F4/1 G4/0.75 D#4/0.25 F4/4 A#4/0.75 A#4/0.25 ' +
				'F4/0.75 F4/0.25 G4/1 D#4/0.75 D4/0.25 C4/4 D4/0.5 D4/0.5 D#4/0.5 ' +
				'C4/0.5 D4/0.5 F4/0.5 G4/0.5 A4/0.5 A#4/1 A4/0.5 G4/0.5 F4/0.5 ' +
				'D#4/0.5 D4/1 F4/0.75 F4/0.25 D#4/0.75 D4/0.25 D#4/1 D4/0.75 C4/0.25 ' +
				'A#3/3 r/1 A#3/1 C4/0.75 D#4/0.25 C#4/1 C4/0.75 A3/0.25 A#3/3 A#3/1 ' +
				'C4/0.75 C4/0.25 C#4/0.75 D#4/0.25 F4/0.75 F4/0.25 G4/0.75 A4/0.25 ' +
				'A#4/4 D#4/1 F4/1 A4/0.75 A4/0.25 A#4/1 C5/0.5 C#5/0.5 C5/0.5 ' +
				'A#4/0.5 C5/0.5 A4/0.5 A#4/1 F4/1 D#4/0.75 D4/0.25 D#4/0.75 D#4/0.25 ' +
				'D4/0.75 C4/0.25 A#3/3 r/1 A#3/0.75 A#3/0.25 D4/0.75 D#4/0.25 ' +
				'F4/0.75 F4/0.25 G4/0.75 D#4/0.25 F4/4 A#4/0.75 A#4/0.25 F4/0.75 ' +
				'F4/0.25 G4/0.75 G4/0.25 D#4/0.75 D4/0.25 C4/4 D4/0.5 D4/0.5 D#4/0.5 ' +
				'C4/0.5 D4/0.5 F4/0.5 G4/0.5 A4/0.5 A#4/1 A4/0.5 G4/0.5 F4/0.5 ' +
				'D#4/0.5 D4/1 F4/0.75 F4/0.25 D#4/0.75 D4/0.25 D#4/1 D4/0.75 C4/0.25 ' +
				'A#3/4',
		},
		// Chagla wrote the music in 1949, three years before the words were
		// chosen; first broadcast 13 August 1954 and adopted three days later.
		composed: '1949',
		adopted: '1954-08-16',
	},
}
