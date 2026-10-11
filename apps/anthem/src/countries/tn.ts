import { Country } from './Country'

export const tn: Country = {
	code: 'tn',
	name: {
		en: 'Tunisia',
		ar: 'تونس',
		de: 'Tunesien',
		el: 'Τυνησία',
		sv: 'Tunisien',
		th: 'ตูนิเซีย',
		tr: 'Tunus',
		zh: '突尼斯',
	},
	flag: '🇹🇳',
	nativeLanguage: 'ar',
	anthem: {
		nativeName: 'حماة الحمى',
		name: {
			en: 'Defenders of the Homeland',
		},
		// the main section, as sung in schools and stadiums: the chorus,
		// Echebbi's stanza, the chorus again — 12 lines
		lyrics: ['ar'],
		// no intro: the US Navy Band is into the chorus at 0.46 s, and the
		// recording has no gap anywhere in its 52 s
		instrument: {
			hash: 'fd73767aec97',
			intro: 0,
		},
		score: {
			// A♭ major, 80¼ beats of 2/4 in six strains: chorus A A, Echebbi's
			// stanza B C, chorus A A — the form the recording plays. Transcribed
			// from the 8notes voice line (midi/README.md), which is in G, and
			// moved up a semitone to the recording, measured from fundamentals
			// (C, A♭, B♭, E♭ far ahead of the rest). The synth has no rests, so
			// each strain's closing note holds through the breath that follows.
			// Tempo: the MIDI marks 100, the engraved sheet 104; the band runs
			// at 99 over its span and slows for the final hold
			tempo: 100,
			key: 'Ab major',
			hash: 'c5f35ee0f5a1',
		},
		// music from the 1930s, attributed to Mohammed Abdel Wahab or to Ahmed
		// Kheireddine; Al-Rafi'i's poem is from the same decade, Echebbi's
		// stanza was added in 1955. Adopted provisionally 1957-07-25
		adopted: '1987-11-12',
	},
}
