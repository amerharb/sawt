import { Country } from './Country'

export const ar: Country = {
	code: 'ar',
	name: {
		en: 'Argentina',
		ar: 'الأرجنتين',
		de: 'Argentinien',
		el: 'Αργεντινή',
		sv: 'Argentina',
		th: 'อาร์เจนตินา',
		tr: 'Arjantin',
		zh: '阿根廷',
	},
	flag: '🇦🇷',
	nativeLanguage: 'es',
	anthem: {
		nativeName: 'Himno Nacional Argentino',
		name: {
			en: 'Argentine National Anthem',
			de: 'Argentinische Nationalhymne',
			sv: 'Argentinas nationalsång',
		},
		// The words as sung since the decree of 1900 — the first quatrain, the
		// last, and the chorus — with the repeats written out as the Spanish
		// Wikipedia prints the 1944 decree's text. López y Planes died in 1856,
		// Parera in 1840, and Esnaola, whose 1860 arrangement is the official
		// music, in 1878.
		lyrics: ['es'],
		/*
		 * The tape is the Navy Band's *abridged* form: the whole introduction —
		 * eleven slow bars to 37.2 s, a breath, twelve fast bars to 64.3 s — and
		 * then the chorus from 65.9 s to the end. The intro ends where the chorus
		 * begins, at the gap of 64.3–65.9 s; 64.5 was chosen by ear against 37.5,
		 * the breath between the introduction's two halves.
		 *
		 * No 🎤 or 👥. Commons' one sung file is the 2019 Casa Rosada recording
		 * by the Coro Polifónico Nacional, tagged PD-AR-Music — but that tag
		 * covers recordings published seventy years ago, and this one is six
		 * years old, so it is not free. Set aside.
		 */
		intro: 64.5,
		score: {
			/*
			 * B♭ major, 96 beats — the chorus, bars 58–78 of Esnaola's official
			 * form: three bars of lead-in, "Sean eternos los laureles", the slow
			 * "Coronados de gloria vivamos" and "O juremos con gloria morir" three
			 * times. From Julián Tavela's two-violin MusicXML on IMSLP, the first
			 * violin (see midi/README.md), checked against Héctor Monacci's typeset
			 * of the official version. Bars 67–69 are doubled: the sheet marks
			 * ♩ = 76 and then 60 there against 132 around them, the band takes
			 * them so (12.1 s for twelve printed beats), and the app's score has
			 * one tempo. Where the singer rests in bars 62 and 64 the violin fills
			 * with a low trill from the accompaniment; the score rests there.
			 *
			 * **No transposition**: the tape's final chord is B♭–D–F and the fast
			 * introduction ends on the same triad, as the sheet's two flats say.
			 *
			 * Tempo 132, the printed one, chosen by ear from 126, 132 and 135; the
			 * band measures 130–135 across the chorus, so 🎼 runs 43.6 s against
			 * the band's 41.4.
			 */
			tempo: 132,
			melody:
				'F4/1 F4/0.25 E4/0.25 F4/0.25 E4/0.25 F4/0.25 E4/0.25 F4/0.25 ' +
				'E4/0.25 F4/0.25 G4/0.25 A4/0.25 F4/0.25 A#4/1 A#4/0.25 A4/0.25 ' +
				'A#4/0.25 C5/0.25 D5/0.5 D5/0.375 D#5/0.125 C5/0.5 C5/0.375 D5/0.125 ' +
				'A#4/1 A#4/0.5 r/0.25 A#4/0.25 A#4/0.5 r/0.5 F5/0.75 F5/0.25 A#5/1 ' +
				'F5/1 D5/1 F5/1 A#5/1 r/2 F5/0.75 F5/0.25 A#5/1 F5/1 D5/1 F5/1 A#5/1 ' +
				'r/2 A#4/0.75 D5/0.25 C5/1 A#4/1 A4/1 G4/1 F4/2 r/1 A#5/0.75 A5/0.25 ' +
				'A5/2 G5/1.5 F5/0.5 F5/1 D#5/1 D#5/1.5 D5/0.5 D5/3 F5/1 E5/1 F5/1 ' +
				'G5/1 F5/1 C5/8 r/2.5 F5/0.5 G5/0.5 A5/0.5 A#5/1 A#5/0.5 A#5/0.5 ' +
				'A5/1 A5/0.5 A5/0.5 A#5/1 r/1 D#5/1.5 D#5/0.5 D#5/0.5 D5/0.5 C5/0.5 ' +
				'A#4/0.5 F4/1 A4/0.5 A4/0.5 A#4/1 r/1 D#5/1.5 D#5/0.5 D#5/0.5 D5/0.5 ' +
				'C5/0.5 A#4/0.5 F5/1 A4/0.5 A4/0.5 A#4/1 r/0.5 D5/0.5 A#4/0.5 D5/0.5 ' +
				'A#4/0.5 D5/0.5 A#4/1 r/1 A#4/1 r/0.5 A#4/0.5 A#4/4',
		},
		// López y Planes's words and Parera's music were adopted together by the
		// Assembly of the Year XIII on 11 May 1813.
		composed: '1813',
		adopted: '1813-05-11',
	},
}
