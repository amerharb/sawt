import { Country } from './Country'

export const va: Country = {
	code: 'va',
	name: {
		en: 'Vatican City',
		ar: 'الفاتيكان',
		de: 'Vatikanstadt',
		el: 'Βατικανό',
		sv: 'Vatikanstaten',
		th: 'นครวาติกัน',
		tr: 'Vatikan',
		zh: '梵蒂冈',
	},
	flag: '🇻🇦',
	nativeLanguage: 'la',
	anthem: {
		nativeName: 'Inno e Marcia Pontificale',
		name: {
			en: 'Pontifical Anthem and March',
		},
		// the only country here that sings its anthem in two languages of its own:
		// Allegra's Italian of 1949 and the Latin sung today, a shortened form of
		// Lavagna's 1991 text
		lyrics: ['it', 'la'],
		// no intro: the march opens on the tune, at 0.44 s, and the eight breaks in
		// the recording all fall between strains
		instrument: {
			hash: 'f7bad8f52831',
			intro: 0,
		},
		score: {
			// F major, 287 beats of 4/4 — the whole march, all 72 bars, which makes
			// this by some way the longest score in the app. From the CC0 MIDI on
			// Commons (midi/README.md), sequenced by Peter Gerloff and in D; Gounod
			// died in 1893, so unlike every other source here it could simply be
			// committed. Moved up three semitones to the US Navy Band recording,
			// measured from fundamentals. The MIDI carries the tune across two
			// instruments — horn, with the trumpet taking bars 25 to 32 — so the two
			// lines are merged into the one melody the synth plays. Tempo 100 is the
			// MIDI's own marking; the band covers the same 287 beats in 178 s, which
			// is 97, and 100 was chosen by ear against it
			tempo: 100,
			key: 'F major',
			hash: '8b229b3c8539',
		},
		// written for Pius IX's golden jubilee, 11 April 1869, and eighty years
		// later made the anthem in place of Hallmayer's march
		composed: '1869',
		adopted: '1949-10-16',
	},
}
