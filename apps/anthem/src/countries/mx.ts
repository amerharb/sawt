import { Country } from './Country'

export const mx: Country = {
	code: 'mx',
	name: {
		en: 'Mexico',
		ar: 'المكسيك',
		de: 'Mexiko',
		el: 'Μεξικό',
		sv: 'Mexiko',
		th: 'เม็กซิโก',
		tr: 'Meksika',
		zh: '墨西哥',
	},
	flag: '🇲🇽',
	nativeLanguage: 'es',
	anthem: {
		nativeName: 'Himno Nacional Mexicano',
		name: {
			en: 'Mexican National Anthem',
			de: 'Mexikanische Nationalhymne',
			sv: 'Mexikos nationalsång',
		},
		// The official text as article 57 of the 1984 law fixes it: the chorus
		// and four stanzas — the poem's I, V, VI and X — ten quatrains with the
		// chorus written out at the start and the end, as the page prints them.
		// Bocanegra died in 1861 and Nunó in 1908; Mexico's law reserves the state
		// a say over how the anthem is used, not a copyright.
		lyrics: ['es'],
		// No intro: neither the sheet nor the band has one. The tape opens on the
		// chorus's pickup at 1.2 s, and 1.2 s is not a 🥁 worth having.
		//
		// No 🎤 or 👥. Commons has no sung recording of the anthem at all — the
		// Secretariat of Defence's files there are the Canto a la Bandera, another
		// song — and the 1968 Mexican Navy band recording carries only tags for
		// the composition, so the US Navy Band tape is the one clean recording.
		score: {
			/*
			 * E♭ major, 166 beats, cut time — the sheet's whole form: the chorus
			 * (twelve bars to *Fine*), the stanza, and the chorus again *da capo*,
			 * which is exactly what the band plays, 1.2 s to 100.4 s. From the
			 * flutetunes lead sheet's flute line (see midi/README.md).
			 *
			 * **Transposed up a minor third** from the sheet's C: the tape's final
			 * chord is E♭–G–B♭ and the chorus ends on the same triad, and the held
			 * melody tonics measure E♭ from their fundamentals where the bass does
			 * not drown them. Chroma could not choose between E♭ and B♭ — the two
			 * scales share six notes of seven — so the chord decided it.
			 *
			 * Tempo 120, the printed 𝅗𝅥 = 60, chosen by ear from 100, 104 and 120.
			 * The band is far slower — the chorus at 102.75, the whole at about 103
			 * — so 🎼 runs 83 s against the tape's 99 s of tune.
			 */
			tempo: 120,
			melody:
				'D#5/0.75 G5/0.25 A#5/1 A#5/0.75 A#5/0.25 A#5/1 A#5/0.375 C6/0.25 ' +
				'D6/0.375 D#6/2 A#5/1 G5/0.75 G5/0.25 F5/1 G5/0.75 G5/0.25 G#5/1 ' +
				'A#5/0.75 A#5/0.25 G5/1 D#5/2 D#6/0.75 D#6/0.25 D6/1 C#6/0.75 ' +
				'C#6/0.25 C6/1 B5/0.75 B5/0.25 A#5/1 D#6/2 C6/0.75 D6/0.25 D#6/1 ' +
				'G5/0.75 G#5/0.25 A#5/1 G#5/0.375 G5/0.25 F5/0.375 D#5/1 r/2 G5/0.75 ' +
				'A#5/0.25 D#6/1 D#6/0.75 D#6/0.25 D#6/1 D#6/0.75 F6/0.25 G6/1.5 ' +
				'F6/0.5 D#6/1 D#6/0.75 D#6/0.25 D#6/1 G5/0.75 C6/0.25 A#5/1 ' +
				'G#5/0.375 G5/0.25 F5/0.375 D#5/1 r/2 A#5/0.75 A#5/0.25 A#5/1 ' +
				'A#5/0.5 F6/0.5 D#6/0.5 D6/0.5 C6/0.5 D6/0.5 D#6/2 A#5/1 G5/0.5 ' +
				'A#5/0.5 A#5/0.75 G#5/0.25 G#5/0.5 C6/0.5 C6/0.5 A#5/0.5 D6/0.75 ' +
				'C6/0.25 A#5/1.75 G#5/0.25 G5/1 A#5/0.75 A#5/0.25 A#5/1 A#5/0.5 ' +
				'F6/0.5 D#6/0.5 D6/0.5 C6/0.5 D6/0.5 D#6/0.5 A#5/0.5 G6/2 F6/0.5 ' +
				'D#6/0.5 D6/0.5 D#6/0.25 D6/0.25 C#6/0.5 D6/0.5 F6/1 D#6/0.75 ' +
				'C6/0.25 A#5/1 r/2 A#5/0.75 A#5/0.25 A#5/1 A#5/0.75 A#5/0.25 A#5/1 ' +
				'A#5/0.75 B5/0.25 C#6/1 F#6/2 A#5/0.75 C#6/0.25 C#6/0.75 B5/0.25 ' +
				'B5/0.5 D#6/0.5 D#6/0.5 C#6/0.5 F6/0.75 D#6/0.25 C#6/1.75 B5/0.25 ' +
				'A#5/1 A#5/0.75 A#5/0.25 B5/0.5 A#5/1 A#5/0.5 B5/0.5 A#5/1 A#5/0.5 ' +
				'D#6/1.5 F6/0.5 F#6/1 D#6/0.75 D#6/0.25 D#6/0.5 F#5/0.5 F#5/0.5 ' +
				'F#5/0.5 G#5/1 F#5/0.75 G#5/0.25 A#5/1 D6/1 D#6/1 F6/1 F#6/0.5 ' +
				'D#6/0.5 D6/0.5 D#6/0.5 F6/1 D#6/0.75 D#6/0.25 A#5/1 r/2 D#5/0.75 ' +
				'G5/0.25 A#5/1 A#5/0.75 A#5/0.25 A#5/1 A#5/0.375 C6/0.25 D6/0.375 ' +
				'D#6/2 A#5/1 G5/0.75 G5/0.25 F5/1 G5/0.75 G5/0.25 G#5/1 A#5/0.75 ' +
				'A#5/0.25 G5/1 D#5/2 D#6/0.75 D#6/0.25 D6/1 C#6/0.75 C#6/0.25 C6/1 ' +
				'B5/0.75 B5/0.25 A#5/1 D#6/2 C6/0.75 D6/0.25 D#6/1 G5/0.75 G#5/0.25 ' +
				'A#5/1 G#5/0.375 G5/0.25 F5/0.375 D#5/1 r/2 G5/0.75 A#5/0.25 D#6/1 ' +
				'D#6/0.75 D#6/0.25 D#6/1 D#6/0.75 F6/0.25 G6/1.5 F6/0.5 D#6/1 ' +
				'D#6/0.75 D#6/0.25 D#6/1 G5/0.75 C6/0.25 A#5/1 G#5/0.375 G5/0.25 ' +
				'F5/0.375 D#5/1',
		},
		// Bocanegra's words won the 1853 contest and Nunó's music the 1854 one;
		// first sung 15 September 1854 at the Teatro Santa Anna, and made official
		// by decree on 4 May 1943 — the law of 1984 fixed the four stanzas.
		composed: '1854',
		adopted: '1943-05-04',
	},
}
