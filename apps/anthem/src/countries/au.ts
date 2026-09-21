import { Country } from './Country'

export const au: Country = {
	code: 'au',
	name: {
		en: 'Australia',
		ar: 'أستراليا',
		de: 'Australien',
		el: 'Αυστραλία',
		sv: 'Australien',
		th: 'ออสเตรเลีย',
		tr: 'Avustralya',
		zh: '澳大利亚',
	},
	flag: '🇦🇺',
	nativeLanguage: 'en',
	anthem: {
		nativeName: 'Advance Australia Fair',
		name: {
			en: 'Advance Australia Fair',
		},
		// The two stanzas the state adopted, which are McCormick's first verse and
		// a rewriting of his others. His words are public domain — he died in 1916
		// — and the two later edits are the state's own: "Australia's sons" became
		// "Australians all" on adoption in 1984, and "young" became "one" by
		// proclamation in 2021.
		lyrics: ['en'],
		/*
		 * No intro. The Navy Band is playing the tune from the first sample: the
		 * score's chroma slides against the recording to a best fit at offset
		 * 0.00 s, and the correlation there (0.62) falls away sharply on either
		 * side, so there is no room for a fanfare to hide in. The shorter
		 * "abridged" cut of the same performance opens on the same note.
		 */
		score: {
			/*
			 * B♭ major, 21 bars of 4/4 after a one-beat anacrusis, 80 beats. From
			 * the public-domain MIDI of the 1907 first edition (midi/au.midi) — a
			 * four-part setting in C, of which the melody is the soprano.
			 *
			 * Transposed down two semitones to the band's B♭, which was measured
			 * rather than chosen: of the five held notes closing the five phrases,
			 * three come back at exactly −2 semitones and the other two land on D
			 * and F, the third and fifth of B♭. Wikipedia's own caption for this
			 * recording says B♭ too. All 70 notes are then diatonic, with no
			 * accidental to explain away.
			 *
			 * Tempo 95 from the recording: 80 beats is 50.5 s against the band's
			 * 52.6 s of music, the rest being the ritardando on the last note.
			 */
			tempo: 95,
			melody:
				'F4/1 Bb4/1 F4/1 D4/1 F4/1 Bb4/1.5 Bb4/0.5 Bb4/1 D5/1 C5/1 Bb4/1 ' +
				'A4/1 Bb4/1 C5/3 F4/1 Bb4/1 F4/1 D4/1 Bb3/1 F4/1.5 F4/0.5 F4/1 ' +
				'D5/1 C5/1 Bb4/1 A4/1 G4/1 F4/3 F4/1 G4/1.5 A4/0.5 Bb4/1 G4/1 ' +
				'F4/1.5 D4/0.5 D4/1 F4/1 G4/1 Bb4/1 Eb5/1 D5/1 C5/3 F4/1 G4/1.5 ' +
				'A4/0.5 Bb4/1 G4/1 F4/1.5 Bb4/0.5 Bb4/1 C5/1 D5/1.5 Bb4/0.5 ' +
				'C5/1.5 A4/0.5 Bb4/3 D5/1 Eb5/1 D5/1 C5/1 Bb4/1 A4/1 G4/1 F4/1 ' +
				'Bb4/1 D5/1.5 Bb4/0.5 C5/1.5 A4/0.5 Bb4/3',
		},
		// First published in Sydney in December 1878, under the pen-name "Amicus".
		// It was made the anthem in 1974, demoted to one of three "national songs"
		// in 1976, and proclaimed again on 19 April 1984, which is the date that
		// has held.
		composed: '1878',
		adopted: '1984-04-19',
	},
}
