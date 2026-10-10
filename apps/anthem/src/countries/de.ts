import { Country } from './Country'

export const de: Country = {
	code: 'de',
	name: {
		en: 'Germany',
		ar: 'ألمانيا',
		de: 'Deutschland',
		el: 'Γερμανία',
		sv: 'Tyskland',
		th: 'เยอรมนี',
		tr: 'Almanya',
		zh: '德国',
	},
	flag: '🇩🇪',
	nativeLanguage: 'de',
	anthem: {
		nativeName: 'Das Lied der Deutschen',
		name: {
			en: 'The Song of the Germans',
		},
		// Hoffmann von Fallersleben died in 1874, so the words are public domain.
		// The file holds all three stanzas of the song; only the third is the anthem.
		lyrics: ['de'],
		// no intro — the recording opens on the tune. The silences at 14.7 s and
		// 28.1 s are strain boundaries inside Haydn's melody, not an introduction.
		instrument: {
			hash: '9706688e0bf5',
			intro: 0,
		},
		score: {
			// E♭ major, twenty bars, in the key the recording is actually in — no
			// transposition. Three sources agree on the key: the published melody sheet
			// (three flats), the MIDI, and the recording itself, which cadences B♭2 → E♭3.
			//
			// Transcribed from the public-domain Gotterhalte.mid on Wikimedia Commons,
			// one format-0 track ten voices deep with no melody line: this is the highest
			// voice sounding above C4, which finds the tune in a hymn because the tune is
			// on top. The single chromatic A natural — the raised fourth leading to B♭ —
			// appears as a ♮ in the published sheet too, which is the one independent
			// check this reading has passed. The other Commons MIDI, the CC0 Einigkeit und
			// Recht.mid, is piano texture across four untitled tracks and its top voice
			// diverges by the third note, so it confirmed nothing.
			tempo: 71,
			key: 'Eb major',
			hash: '7b85b99c0c05',
		},
		composed: '1797',
		adopted: '1922',
	},
}
