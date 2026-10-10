import { Country } from './Country'

export const gb: Country = {
	code: 'gb',
	name: {
		en: 'United Kingdom',
		ar: 'المملكة المتحدة',
		de: 'Vereinigtes Königreich',
		el: 'Ηνωμένο Βασίλειο',
		sv: 'Storbritannien',
		th: 'สหราชอาณาจักร',
		tr: 'Birleşik Krallık',
		zh: '英国',
	},
	flag: '🇬🇧',
	nativeLanguage: 'en',
	anthem: {
		nativeName: 'God Save the King',
		name: {
			en: 'God Save the King',
		},
		// Verse 1 is the traditional text: anonymous, first printed with the tune in
		// 1744-45, so unambiguously public domain.
		//
		// Verses 2 and 3 are deliberately *not* the "scatter his enemies" / "thy
		// choicest gifts" verses that most sources print second and third. They are
		// the peaceable alternative set ("one realm of races four", "spread universal
		// peace"), chosen for the app. Unlike every other country here their author
		// is not recorded — they read as a later addition, and the usual check of
		// author plus death year could not be completed. Kept on the reasonable view
		// that they are old enough, but that is weaker ground than the rest.
		lyrics: ['en'],
		// The Navy Band recording opens on a drum roll, unpitched from the first
		// sample to the last: it swells from −54 dB to −21 dB at 5.5 s and dies
		// away to −49 dB by 11 s, and the tune enters at 11.8. The fading half
		// was once read as a 2.2-second silence after a fanfare, but it never
		// turns tonal — it measures like Belgium's and Pakistan's rolls. 11.8
		// puts the whole roll in 🥁 and gives 🎺 a clean start on the first note.
		instrument: {
			hash: '5c196159fecf',
			intro: 11.8,
			introType: 'drum',
		},
		score: {
			// B♭ major, 42 beats — fourteen bars of 3/4, one statement of the tune.
			// The MIDI plays it twice; only the first pass is kept.
			//
			// The second score in the project that needed no corroborating source:
			// it opens G-G-A-F♯-G-A-B in the original G, which is "God save our
			// gra-cious King" note for note, predictable before extracting it.
			// Transposed up a minor third to the recording's B♭, where it is fully
			// diatonic — no accidentals to explain away.
			tempo: 88,
			key: 'Bb major',
			hash: 'd4e04092f812',
		},
		choral: {
			hash: '43fb3b24423d',
			intro: 0,
		},
		// The tune's first known printing, in Thesaurus Musicus; the composer is
		// unknown. It reached the stage the following year, which is when it began
		// to be treated as the anthem — by custom, never by statute, so 1745 is a
		// date of adoption in practice rather than in law.
		composed: '1744',
		adopted: '1745',
	},
}
