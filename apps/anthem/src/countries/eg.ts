import { Country } from './Country'

export const eg: Country = {
	code: 'eg',
	name: {
		en: 'Egypt',
		ar: 'مصر',
		de: 'Ägypten',
		el: 'Αίγυπτος',
		sv: 'Egypten',
		th: 'อียิปต์',
		tr: 'Mısır',
		zh: '埃及',
	},
	flag: '🇪🇬',
	nativeLanguage: 'ar',
	anthem: {
		nativeName: 'بلادي بلادي بلادي',
		name: {
			en: 'My Homeland, My Homeland, My Homeland',
		},
		// Words Younis al-Qadi, died 1969. Egypt's term is life + 50 under Law
		// 82/2002 art. 160 — not the life + 70 used across Europe — so they entered
		// the public domain in 2020. Worth remembering: the term belongs to the
		// country, and assuming the European one blocks anthems that are actually free.
		lyrics: ['ar'],
		// the one silent gap in the whole file, and the published melody line rests
		// through the opening bars before entering — an intro on paper as well as in
		// the recording
		intro: 3.5,
		score: {
			// F major, 86 beats. From the BitMidi `trumpet(s)` track, needing no
			// transposition — the source, the recording and the published sheet all
			// agree on F.
			//
			// The sheet settles the rest: 2/4, marked Allegretto maestoso ♩ = 96, with
			// first and second endings so the melody is played twice — which the MIDI
			// already does, its opening twelve notes recurring at 17.5 beats of 86. The
			// closing `Ralle` is why the recording measures nearer 64 across its length
			// while being marked 96; 96 is the tempo, the rallentando is the reading.
			tempo: 96,
			melody:
				'C4/0.5 F4/1 F4/0.5 C4/0.5 F4/1 F4/0.5 E4/0.5 F4/0.5 G4/1.5 A4/0.5 ' +
				'F4/1 A4/0.5 Bb4/0.5 C5/1 A4/0.5 G4/0.5 F4/0.5 A4/0.5 G4/0.5 ' +
				'A4/0.5 F4/1 E4/1 G4/0.5 F4/1.5 r/0.5 C4/0.5 F4/1 F4/0.5 C4/0.5 ' +
				'F4/1 F4/0.5 E4/0.5 F4/0.5 G4/1.5 A4/0.5 F4/1 A4/0.5 Bb4/0.5 C5/1 ' +
				'A4/0.5 G4/0.5 F4/0.5 A4/0.5 G4/0.5 A4/0.5 F4/1 E4/0.5 G4/0.5 F4/1 ' +
				'A4/0.5 A4/0.5 A4/1 G4/0.5 F4/0.5 Bb4/1 A4/1 G4/2.5 r/0.5 Bb4/1 ' +
				'Bb4/1 A4/0.5 G4/0.5 C5/1 Bb4/1 A4/3 A4/0.5 r/0.5 A4/0.5 A4/1 ' +
				'G4/0.5 F4/0.5 Bb4/1 A4/1 G4/1.5 A4/0.5 Bb4/0.5 C5/1 C5/0.5 r/0.5 ' +
				'C5/0.5 C5/1 A4/0.5 G4/0.5 F4/0.5 A4/0.5 G4/0.5 A4/0.5 F4/1 E4/0.5 ' +
				'G4/0.5 F4/1.5 r/0.5 C4/0.5 F4/1 F4/0.5 C4/0.5 F4/1 F4/0.5 E4/0.5 ' +
				'F4/0.5 G4/1.5 A4/0.5 F4/1 A4/0.5 Bb4/0.5 C5/1 A4/0.5 G4/0.5 ' +
				'F4/0.5 A4/0.5 G4/0.5 A4/0.5 F4/1 E4/0.5 G4/0.5 F4/3',
		},
		composed: '1923',
		adopted: '1979',
	},
}
