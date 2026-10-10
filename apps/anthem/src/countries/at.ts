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
		instrument: {
			hash: '057f362121b6',
			intro: 4.4,
			introType: 'fanfare',
		},
		score: {
			// F major, 3/4. One verse, taken from the CC0 four-voice MIDI on
			// Wikimedia Commons (its track 1 soprano, highest note per onset). The
			// arrangement is in D; transposed up a minor third to the recording's
			// key. Tempo measured from the recording's ~11.5 s phrases, not the
			// MIDI's own 110.
			tempo: 63,
			key: 'F major',
			hash: 'd9b82e1fd95b',
		},
		composed: '1791',
		adopted: '1946-10-22',
	},
}
