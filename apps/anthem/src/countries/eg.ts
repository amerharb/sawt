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
		// the recording. What fills it is a drum roll on the timpani, B♭ struck
		// some nine times a second from 1.5 s and held until the tune's C4 pickup
		// at 3.5 s — so, as a drum intro, it has no notes in the melody.
		instrument: {
			hash: 'ce46581573f3',
			intro: 3.5,
			introType: 'drum',
		},
		score: {
			/*
			 * F major, 79.25 beats — the top line of Sayed Darwish's "Bilady" in the
			 * piano arrangement on nationalanthems.info (CC BY 4.0, credited in
			 * README.md; see midi/README.md): a pickup and twenty bars, A A' B B'
			 * and A again an octave up to close. It replaced a World Atlas
			 * trumpet line that played the dotted rhythm even and missed the
			 * shape of the middle section. Where the voice would hold a note, in
			 * bars 10, 12, 14 and 16, the top line carries the piano's own short
			 * runs, and those stay — they are the sheet's.
			 *
			 * Tempo 96, the Allegretto maestoso ♩ = 96 a published 2/4 sheet marks.
			 * The band is slower — it takes these 79 beats in 64.6 s, 73.6 to the
			 * quarter — and 🎼 is not held to the band's pace.
			 */
			tempo: 96,
			key: 'F major',
			hash: '482360cf6393',
		},
		composed: '1923',
		adopted: '1979',
	},
}
