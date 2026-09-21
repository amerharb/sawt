import { Country } from './Country'

export const pe: Country = {
	code: 'pe',
	name: {
		en: 'Peru',
		ar: 'بيرو',
		de: 'Peru',
		el: 'Περού',
		sv: 'Peru',
		th: 'เปรู',
		tr: 'Peru',
		zh: '秘鲁',
	},
	flag: '🇵🇪',
	nativeLanguage: 'es',
	anthem: {
		nativeName: 'Himno Nacional del Perú',
		name: {
			en: 'National Anthem of Peru',
		},
		// The chorus and the one stanza Peru sings, as sung — the repeated
		// half-lines are in the official text, not an artefact. The Ministry of
		// Defence ordered that stanza used in 2009 in place of the familiar "Largo
		// tiempo el peruano oprimido", which Torre Ugarte did not write. He died in
		// 1831 and Alcedo in 1878, the earliest pair of death years in the app.
		lyrics: ['es'],
		// 3.53 s, where the score starts to lock. Short, but Egypt's is 3.5 and
		// Belgium's 3.63.
		intro: 3.53,
		score: {
			/*
			 * F major, turning to B♭ for the second half, 78.5 beats. From the
			 * `Melody` track of the World Atlas MIDI — monophonic all the way, so
			 * nothing had to be picked out of an arrangement.
			 *
			 * **The chorus only.** The MIDI carries the whole anthem — chorus,
			 * verse, chorus — but the recordings play just the chorus, and that is
			 * established rather than assumed: the chorus matches at r = 0.73 and
			 * the verse at 0.10, which is no match at all. One structural check
			 * came out exactly — the closing phrase is written twice, notes 53–74
			 * and 75–96, and the two are note-for-note identical, both resolving to
			 * F, which is where the score is cut.
			 *
			 * So 🎼 runs about 44 s against 🎺's 57, as Poland's and Japan's also
			 * do. Ten of those seconds are the band's own close, which matched no
			 * phrase in the MIDI at any tempo and is not written out here.
			 *
			 * Tempo 106 from the recording; the alignment is at 3.53 s.
			 */
			tempo: 106,
			melody:
				'C5/0.75 C5/0.25 F5/2 C5/1.5 C#5/0.25 D5/2 A4/1.5 C5/0.25 A#4/1 A4/0.75 A4/0.25 ' +
				'G4/1 F4/0.75 F4/0.25 C5/1 C5/2 C5/0.75 C5/0.25 F5/2 C5/1.5 C#5/0.25 D5/2 ' +
				'A4/1.5 C5/0.25 A#4/1 A4/0.75 A4/0.25 G4/1 F4/0.75 F4/0.25 C5/3 G4/0.75 A4/0.25 ' +
				'A#4/1 A#4/0.75 A#4/0.25 A#4/0.5 D5/0.5 C5/0.5 A#4/0.5 A#4/1 A4/2 G4/0.75 A4/0.25 ' +
				'A#4/1 A#4/0.75 A#4/0.25 A#4/0.5 D5/0.5 C5/0.5 A#4/0.5 A#4/1 A4/2 C5/0.75 D5/0.25 ' +
				'D#5/0.25 r/0.75 D#5/0.75 D#5/0.25 D#5/0.5 G5/0.5 F5/0.5 D#5/0.5 D#5/1 D5/1.5 F5/0.5 ' +
				'E5/0.5 D5/0.5 C5/1 A4/0.75 C5/0.25 C5/0.5 A#4/0.5 A4/0.5 G4/0.5 F4/3 C5/0.75 ' +
				'D5/0.25 D#5/1 D#5/0.75 D#5/0.25 D#5/0.5 G5/0.5 F5/0.5 D#5/0.5 D#5/1 D5/1.5 F5/0.5 ' +
				'E5/0.5 D5/0.5 C5/1 A4/0.75 C5/0.25 C5/0.5 A#4/0.5 A4/0.5 G4/0.5 F4/2.5',
		},
		// Alcedo won the competition San Martín called in 1821, and it was first
		// sung in Lima that September. Peru has kept it since, unaltered enough
		// that a 1991 MIDI is still the right anthem.
		composed: '1821',
		adopted: '1821',
	},
}
