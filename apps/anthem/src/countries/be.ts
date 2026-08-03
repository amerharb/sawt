import { Country } from './Country'

export const be: Country = {
	code: 'be',
	name: {
		en: 'Belgium',
		ar: 'بلجيكا',
		de: 'Belgien',
		el: 'Βέλγιο',
		sv: 'Belgien',
		th: 'เบลเยียม',
		tr: 'Belçika',
		zh: '比利时',
	},
	flag: '🇧🇪',
	nativeLanguage: 'nl',
	anthem: {
		nativeName: 'La Brabançonne',
		name: {
			en: 'The Brabantian',
		},
		// a drum roll: unpitched until ~4.1 s, when the band enters
		intro: 4.4,
		score: {
			// Bb major, 4/4 — the key the anthem is written in, kept as written
			// rather than transposed to the recording's F. Melody is the
			// monophonic trumpet(s) line of midi/be.midi; its pitch classes match
			// the published voice line, which is how the notes were verified.
			// Tempo measured from the recording, not the MIDI's own 71.
			tempo: 95,
			melody:
				'F4/0.25 D4/0.5 Eb4/0.25 F4/1.0 G4/0.5 A4/0.25 Bb4/0.75 A4/0.25 ' +
				'Bb4/0.75 D5/0.25 F4/1.5 G4/0.5 F4/1.0 A4/0.75 Bb4/0.25 C5/1.0 ' +
				'C5/0.5 C5/0.25 C5/0.5 C5/0.25 Bb4/0.75 A4/0.25 Bb4/2.25 r/0.5 ' +
				'A4/0.25 Bb4/0.75 G4/0.25 F4/1.0 G4/0.75 A4/0.25 Bb4/0.75 ' +
				'A4/0.25 Bb4/0.75 C5/0.25 A4/1.75 A4/1.0 A4/0.5 G4/0.25 F4/0.75 ' +
				'F4/0.75 A4/0.25 C5/0.5 C5/0.25 Bb4/0.5 G4/0.5 F4/2.5 r/0.5 ' +
				'G4/0.5 F4/0.5 F4/1.5 F4/0.5 F4/0.5 F4/0.25 G4/0.5 A4/0.5 ' +
				'C5/2.0 Bb4/1.5 Bb4/0.25 A4/0.5 A4/0.25 A4/0.75 A4/0.5 Bb4/0.5 ' +
				'A4/0.5 Bb4/0.5 D5/0.5 C5/2.75 F4/0.25 F4/0.5 F4/0.25 Bb4/1.0 ' +
				'Bb4/0.75 Bb4/0.5 Bb4/0.5 Bb4/0.5 C5/0.5 Bb4/0.5 A4/1.75 ' +
				'Bb4/0.5 C5/1.0 r/0.5 C5/0.5 Bb4/1.5 Bb4/0.25 Bb4/0.5 D5/0.25 ' +
				'C5/0.75 Bb4/0.5 A4/2.25 r/0.5 F4/0.25 F4/0.75 F4/0.25 Bb4/1.0 ' +
				'F4/0.75 F4/0.25 D5/0.5 C5/0.25 Bb4/0.75 A4/0.5 G4/2.0 G4/1.0 ' +
				'r/0.75 C5/0.25 Bb4/1.5 Bb4/0.25 A4/1.0 A4/0.5 C5/0.25 Bb4/2.5 ' +
				'r/0.5 F4/1.0 D5/1.5 Bb4/0.25 A4/0.75 F4/0.25 G4/0.5 F4/0.5 ' +
				'F4/2.5 r/0.5 F4/1.0 D5/1.75 Bb4/0.5 A4/0.5 G4/0.5 A4/0.5 ' +
				'C5/0.5 Bb4/3.0',
		},
		composed: '1830',
		adopted: '1830',
	},
}
