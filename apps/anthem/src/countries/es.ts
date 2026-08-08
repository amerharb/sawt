import { Country } from './Country'

export const es: Country = {
	code: 'es',
	name: {
		en: 'Spain',
		ar: 'إسبانيا',
		de: 'Spanien',
		el: 'Ισπανία',
		sv: 'Spanien',
		th: 'สเปน',
		tr: 'İspanya',
		zh: '西班牙',
	},
	flag: '🇪🇸',
	nativeLanguage: 'es',
	anthem: {
		nativeName: 'La Marcha Real',
		name: {
			en: 'The Royal March',
		},
		// No lyrics — not missing, but by law. Words were written twice, Marquina's
		// under Alfonso XIII and Pemán's under Franco, and a public competition in
		// 2007 was withdrawn within days; none was ever adopted. So Spain can never
		// carry `lyrics`, `hasVocal` or `hasChoral`.
		score: {
			// B♭ major, one complete statement — 65 beats to the long tonic B♭ that
			// closes it. No intro, so 🎺 plays the whole file and 🎼 covers all of it.
			//
			// Key and tempo both come from the official publication: the anthem is
			// printed in BOE núm. 244 of 11 October 1997, whose key signature is two
			// flats and whose marking is Maestoso ♩ = 76. That score is a 22-stave
			// orchestral arrangement and no use for the notes, so those are the
			// trumpet track of a BitMidi file, transposed C → B♭.
			//
			// 76 is the marked tempo, not this recording's: the US Navy Band plays it
			// slower, so 🎼 runs 51.3 s against the recording's 56.1 s. Deliberate —
			// the published tempo is what the anthem is.
			tempo: 76,
			melody:
				'Bb4/1 F4/1 D5/1 Bb4/0.5 F5/0.5 Eb5/0.5 D5/0.5 C5/0.5 Bb4/0.5 ' +
				'Bb4/0.5 A4/0.5 G4/0.5 F4/0.5 Bb4/1 C5/1 D5/1.5 r/0.5 F5/0.5 ' +
				'Eb5/0.5 D5/0.5 C5/0.5 Bb4/0.5 F5/1 r/0.5 F4/0.5 G4/0.5 A4/0.5 ' +
				'Bb4/1 F4/1 D5/1 Bb4/0.5 F5/0.5 Eb5/0.5 D5/0.5 C5/0.5 Bb4/0.5 ' +
				'Bb4/0.5 A4/0.5 G4/0.5 F4/0.5 Bb4/1 C5/1 D5/1 r/0.5 F5/0.5 Eb5/0.5 ' +
				'D5/0.5 C5/0.5 Bb4/0.5 F5/1.5 r/0.5 F5/1 D5/0.5 F5/0.5 Eb5/1 ' +
				'C5/0.5 Eb5/0.5 D5/1 Bb4/0.5 D5/0.5 C5/0.5 F4/0.5 G4/0.5 A4/0.5 ' +
				'Bb4/1 C5/1 D5/0.5 Eb5/0.5 F5/0.5 Eb5/0.5 D5/1 C5/1 Bb4/1.5 r/0.5 ' +
				'F5/1 D5/0.5 F5/0.5 Eb5/1 C5/0.5 Eb5/0.5 D5/1 Bb4/0.5 D5/0.5 ' +
				'C5/0.5 F4/0.5 G4/0.5 A4/0.5 Bb4/1 C5/1 D5/0.5 Eb5/0.5 F5/0.5 ' +
				'Eb5/0.5 D5/1 C5/1 Bb4/1.5',
		},
		composed: '1761',
		adopted: '1770',
	},
}
