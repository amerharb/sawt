import { Country } from './Country'

export const at: Country = {
	code: 'at',
	name: {
		en: 'Austria',
		ar: 'النمسا',
		de: 'Österreich',
		el: 'Αυστρία',
		sv: 'Österrike',
		th: 'ออสเตรีย',
		tr: 'Avusturya',
		zh: '奥地利',
	},
	flag: '🇦🇹',
	nativeLanguage: 'de',
	anthem: {
		nativeName: 'Land der Berge, Land am Strome',
		name: {
			en: 'Land of Mountains, Land by the River',
		},
		// Preradović died in 1951, so the words are public domain
		lyrics: ['de'],
		// a quiet sustained tone, then 1.2 s of silence before the anthem enters
		intro: 4.4,
		score: {
			// F major, 3/4. One verse, taken from the CC0 four-voice MIDI on
			// Wikimedia Commons (its track 1 soprano, highest note per onset). The
			// arrangement is in D; transposed up a minor third to the recording's
			// key. Tempo measured from the recording's ~11.5 s phrases, not the
			// MIDI's own 110.
			tempo: 63,
			melody:
				'C5/2.0 Bb4/1.0 A4/2.0 Bb4/0.5 C5/0.5 D5/2.0 C5/1.0 C5/0.5 ' +
				'Bb4/0.5 Bb4/1.5 r/0.5 Bb4/2.0 A4/1.0 G4/2.0 A4/0.5 Bb4/0.5 ' +
				'C5/2.0 Bb4/1.0 Bb4/0.5 A4/0.5 A4/1.5 r/0.5 B4/2.0 C5/1.0 ' +
				'D5/2.0 E5/1.0 F5/1.0 D5/1.0 B4/1.0 C5/2.5 r/0.5 G4/2.0 A4/1.0 ' +
				'C5/1.0 Bb4/1.0 G4/1.0 A4/2.0 D5/0.5 Bb4/0.5 A4/1.0 G4/1.5 ' +
				'r/0.5 G4/2.0 A4/1.0 C5/1.0 Bb4/1.0 G4/1.0 A4/2.0 D5/0.5 ' +
				'Bb4/0.5 A4/1.0 G4/1.5 r/0.5 Bb4/2.0 A4/1.0 D5/2.0 C5/1.0 ' +
				'C5/0.5 Bb4/0.5 A4/1.0 G4/1.0 A4/2.5 r/0.5 D5/2.0 C5/1.0 E5/2.0 ' +
				'F5/0.5 C5/0.5 C5/0.5 Bb4/0.5 A4/1.0 G4/1.0 F4/3.0',
		},
		composed: '1791',
		adopted: '1946-10-22',
	},
}
