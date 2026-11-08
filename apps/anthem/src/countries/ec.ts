import { Country } from './Country'

export const ec: Country = {
	code: 'ec',
	name: {
		en: 'Ecuador',
		ar: 'الإكوادور',
		de: 'Ecuador',
		el: 'Εκουαδόρ',
		sv: 'Ecuador',
		th: 'เอกวาดอร์',
		tr: 'Ekvador',
		zh: '厄瓜多尔',
	},
	flag: '🇪🇨',
	nativeLanguage: 'es',
	anthem: {
		nativeName: 'Salve, oh Patria',
		name: {
			en: 'Hail, O Homeland',
		},
		// The chorus and the second stanza, the one Ecuador sings, in the text
		// the decree of 29 September 1948 made intangible, as the Ministry of
		// Education's 1957 booklet prints it: written out by hand, like Puerto
		// Rico's (see fetch-lyrics.py). Juan León Mera died in 1894 and Antonio
		// Neumane in 1871. Congress's resolution R-22-055 of 2001 says sound
		// reproductions are to use the national symphony orchestra's recording,
		// and decree 1277 of 1977 drops the repeats in public performance. They
		// forbid no use outright, so Ecuador is in by that call, as Uruguay is.
		lyrics: ['es'],
		/*
		 * The United States Navy Band, public domain: its complete version of
		 * about 1997. F major, the key the 2001 resolution calls customary, at a
		 * steady 113: the introduction, the chorus with its repeat, the second
		 * stanza with its repeat and the chorus again. Mixed down to mono, the
		 * trailing silence trimmed with a short fade.
		 *
		 * The intro is the band's introduction, 33 s. The cut at 33.4 s sits in
		 * the silence after its last chord, before the chorus's pickup lands at
		 * 33.48 s.
		 */
		instrument: {
			hash: '77af8894aea0',
			intro: 33.4,
			introType: 'prelude',
		},
		score: {
			/*
			 * F major, 306 beats: the 24-bar chorus from its pickup, the 29-bar
			 * second stanza and the chorus again, both repeats unfolded as the band
			 * plays them. The voice line of the Ministry of Education's 1957
			 * booklet for voice and piano, from IMSLP, public domain (see
			 * midi/README.md): the choir's top voice in the chorus, the solo in the
			 * stanza. Read with the help of the sheet music on nationalanthems.info
			 * (CC BY 4.0, credited in README.md), which holds notes where the
			 * singers rest. The booklet is in G, the stanza in C; written a tone
			 * down.
			 *
			 * **F is measured from the recording**: the band's pitch classes
			 * correlate with F major at 0.92 against 0.72 for any other key, its
			 * last chord is on F, and the melody follows it within 0.3 s from the
			 * first chorus to the last. F chosen by ear over E, the key the 2001
			 * resolution set.
			 *
			 * Tempo 104, the Marcial ♩ = 104 printed in the 1948 and 1957 editions,
			 * chosen by ear over the band's 113; both are inside the resolution's
			 * 100–120.
			 */
			tempo: 104,
			key: 'F major',
			hash: 'bf00ca919331',
		},
		// Mera's words date from 1865 and Neumane set them in 1866. The decree of
		// 29 September 1948 made the anthem official, and the 2001 resolution
		// fixed its music.
		composed: '1866',
		adopted: '1948-09-29',
	},
}
