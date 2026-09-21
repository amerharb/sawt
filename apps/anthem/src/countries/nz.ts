import { Country } from './Country'

export const nz: Country = {
	code: 'nz',
	name: {
		en: 'New Zealand',
		ar: 'نيوزيلندا',
		de: 'Neuseeland',
		el: 'Νέα Ζηλανδία',
		sv: 'Nya Zeeland',
		th: 'นิวซีแลนด์',
		tr: 'Yeni Zelanda',
		zh: '新西兰',
	},
	flag: '🇳🇿',
	nativeLanguage: 'mi',
	anthem: {
		nativeName: 'Aotearoa',
		name: {
			en: 'God Defend New Zealand',
		},
		// Both languages, one verse each, which is what is sung at an occasion —
		// the Māori first and then the English. Not translations of one another:
		// Smith's Māori of 1878 is its own poem. Bracken died in 1898, Smith in
		// 1907 and Woods in 1934, so all three are long clear.
		lyrics: ['mi', 'en'],
		score: {
			/*
			 * A flat major, 65 beats. From the `trumpet(s)` line of the World Atlas
			 * MIDI, which is monophonic but for one overlap on the final chord — the
			 * same shape as Belgium's and Sweden's. Transposed up a semitone from
			 * the file's G to the band's A flat, where all 64 notes come out
			 * diatonic; four of the eight notes held 1.5 beats or more measure that
			 * shift from their fundamentals.
			 *
			 * Tempo 68.75, a sharp peak — 0.50 there against 0.29 at 64 and 0.37 at
			 * 72. No intro; the tune is there from the first sample, and starting it
			 * later fits distinctly worse.
			 *
			 * **A caveat worth stating.** The first three quarters of the piece line
			 * up well — 0.56, 0.69 and 0.68 — but the last quarter does not, 0.25
			 * where the score puts it and 0.41 half a second later, and six seconds
			 * of the recording past 56.8 s match no phrase in the file at any tempo.
			 * The band is doing something at the close that the MIDI does not have,
			 * most likely repeating its last line. So 🎼 is the anthem as written
			 * and 🎺 is six seconds longer than it.
			 */
			tempo: 68.75,
			melody:
				'G#4/1 G4/1 G#4/1 D#4/1 C5/1 C5/0.75 A#4/0.25 G#4/2 F4/1 C#5/1 F4/1 ' +
				'C5/1 A#4/0.5 G#4/0.5 G4/0.5 F4/0.5 D#4/2 G#4/1 D#4/1 F4/1 G4/1 G#4/1 ' +
				'A#4/1 C5/2 C5/1 G#4/1 F4/1 A#4/1 G#4/1 G4/1 G#4/2 D#5/1 D#5/1 ' +
				'G#4/1 C5/1 D#5/1 D#5/0.5 F5/0.5 D#5/2 A#4/1 C5/1 C#5/0.5 C5/0.5 A#4/0.5 ' +
				'G#4/0.5 G4/0.5 G#4/0.5 G4/0.5 F4/0.5 D#4/2 G#4/1 D#4/1 F4/1 G4/1 G#4/1 ' +
				'A#4/1 D#5/2 D#5/1 C#5/1 C5/1 C#5/1 C5/1 A#4/1 G#4/3',
		},
		// Woods set Bracken's poem in 1876 after seeing it in a newspaper; Smith's
		// Māori version followed in 1878. It became the national hymn in 1940 and
		// stood alongside God Save the Queen as an anthem from 1977.
		composed: '1876',
		adopted: '1977',
	},
}
