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
		// a drum roll: unpitched until ~3.3 s, when the band enters. 0.77 s
		// earlier than it used to read — 0.38.0 cut that much dead air off the
		// head of the recording, and every second into the file moved with it
		instrument: {
			hash: '0e9c8763e258',
			intro: 3.63,
			introType: 'drum',
		},
		score: {
			// Bb major, 4/4 — the key the anthem is written in, kept as written
			// rather than transposed to the recording's F. Melody is the
			// monophonic trumpet(s) line of midi/be.midi; its pitch classes match
			// the published voice line, which is how the notes were verified.
			// Tempo measured from the recording, not the MIDI's own 71.
			tempo: 95,
			key: 'Bb major',
			hash: 'd032af04c91d',
		},
		composed: '1830',
		adopted: '1830',
	},
}
