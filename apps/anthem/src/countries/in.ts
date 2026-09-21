import { Country } from './Country'

// Exported as `india`, not `in`: every other country here is named for its code,
// but `in` is a reserved word in JavaScript and cannot be a binding name.
export const india: Country = {
	code: 'in',
	name: {
		en: 'India',
		ar: 'الهند',
		de: 'Indien',
		el: 'Ινδία',
		sv: 'Indien',
		th: 'อินเดีย',
		tr: 'Hindistan',
		zh: '印度',
	},
	flag: '🇮🇳',
	nativeLanguage: 'bn',
	anthem: {
		nativeName: 'Jana Gana Mana',
		name: {
			en: 'Thou Art the Ruler of the Minds of All People',
		},
		// Tagore's Bengali, the seven lines the full version sings. He wrote both
		// the words and the music and died in 1941, so as with Indonesia one death
		// year settles the whole anthem. India's official text is the same words in
		// Devanagari; this is the original.
		lyrics: ['bn'],
		score: {
			/*
			 * E flat major, 116.5 beats. From the `MELODY` track of the World Atlas
			 * MIDI — 249 notes, monophonic throughout, so nothing had to be picked out
			 * of an arrangement. **No transposition**: the Navy Band plays in the key
			 * the file is written in, which five of the eleven notes held 1.5 beats or
			 * more confirm from their fundamentals, the misses all landing on chord
			 * tones.
			 *
			 * **The file holds more than the recording plays.** Its melody runs 198
			 * quarters and repeats a block near the end; the score is notes 0–150, the
			 * anthem once, ending on the tonic.
			 *
			 * Tempo 107 with no intro, and both were measured the same way: every
			 * ending between notes 130 and 144 agrees on 107.00 and on the tune
			 * starting at 0.00 s, and holds its alignment across the piece to within
			 * 0.33 s. Past note 144 the drift jumps to 1.35 s — the band broadening
			 * into the close — so 🎼 at 65.3 s runs a little past 🎺's 63.7 rather
			 * than being fitted to it, the steady pulse being the truer one to
			 * synthesize.
			 */
			tempo: 107,
			melody:
				'D#4/0.5 F4/0.5 G4/0.5 G4/0.5 G4/0.5 G4/0.5 G4/0.5 G4/0.5 G4/1 G4/0.5 G4/0.5 F4/0.5 ' +
				'G4/0.5 G#4/1 G4/1 G4/0.5 G4/0.5 F4/1 F4/0.5 F4/0.5 D4/0.5 F4/0.5 D#4/2 D#4/1 ' +
				'D#4/0.5 A#4/0.5 A#4/0.5 A#4/1 A#4/0.5 A#4/0.5 A#4/1 A#4/0.5 A#4/0.5 A#4/0.5 A4/0.5 C5/0.5 ' +
				'A#4/1 G#4/1 G#4/0.5 G#4/0.5 G#4/1 G#4/0.5 G4/0.5 F4/0.5 G#4/0.5 G4/3 G4/1 G4/0.5 ' +
				'G4/0.5 G4/1 G4/0.5 G4/0.5 G4/0.5 A#4/0.5 A#4/0.5 G#4/0.5 G#4/1 G#4/1 G4/1 G4/0.5 ' +
				'G4/0.5 F4/0.5 F4/0.5 F4/0.5 D4/0.5 D4/0.5 F4/0.5 D#4/3 D#4/0.5 F4/0.5 G4/0.5 G4/0.5 ' +
				'G4/1 G4/1 F4/0.5 G4/0.5 G#4/3 G4/0.5 G#4/0.5 A#4/0.5 A#4/0.5 A#4/1 G#4/0.5 G4/0.5 ' +
				'F4/0.5 G#4/0.5 G4/3 G4/1 G4/1 G4/0.5 G4/0.5 F4/1 F4/1 D4/0.5 F4/0.5 D#4/2 ' +
				'D#4/0.5 A#4/0.5 A#4/0.5 A#4/0.5 A#4/1 A#4/0.5 A4/0.5 A#4/1 A#4/0.5 A#4/0.5 A4/0.5 C5/0.5 ' +
				'A#4/1 G#4/1 G#4/0.5 G#4/0.5 G4/1 G4/0.5 G4/0.5 F4/0.5 G#4/0.5 G4/2 D5/0.5 D5/0.5 ' +
				'D#5/3 D5/0.5 C5/0.5 D5/3 A#4/0.5 A#4/0.5 C5/4 D#4/0.5 D#4/0.5 F4/0.5 F4/0.5 G4/0.5 ' +
				'G4/0.5 F4/0.5 G4/0.5 G#4/4 D#4/0.5 D#4/0.5 D#4/0.5 D#4/0.5 D#4/0.5 D#4/0.5 D4/0.5 D#4/0.5 ' +
				'F4/1 F4/0.5 F4/0.5 F4/1 F4/0.5 F4/0.5 D#4/0.5',
		},
		// Tagore wrote it in 1911 and it was first sung that December in Calcutta;
		// the Constituent Assembly adopted it on 24 January 1950.
		composed: '1911',
		adopted: '1950-01-24',
	},
}
