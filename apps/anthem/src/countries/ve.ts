import { Country } from './Country'

export const ve: Country = {
	code: 've',
	name: {
		en: 'Venezuela',
		ar: 'فنزويلا',
		de: 'Venezuela',
		el: 'Βενεζουέλα',
		sv: 'Venezuela',
		th: 'เวเนซุเอลา',
		tr: 'Venezuela',
		zh: '委内瑞拉',
	},
	flag: '🇻🇪',
	nativeLanguage: 'es',
	anthem: {
		nativeName: 'Gloria al Bravo Pueblo',
		name: {
			en: 'Glory to the Brave People',
		},
		// The chorus once and the first stanza, which is what is sung with it,
		// from Spanish Wikisource (see fetch-lyrics.py), the same words as the
		// 1947 official edition. Vicente Salias and Juan José Landaeta were both
		// executed in 1814. The symbols law of 2006 lets every Venezuelan or
		// foreigner perform the anthem, and fines disrespect or improper use as a
		// regulation is to define; that regulation could not be found.
		lyrics: ['es'],
		/*
		 * The United States Navy Band, public domain: the only free recording.
		 * B♭ major at about 91: the chorus, the first stanza and the chorus
		 * again, slowing into the score's ritardando and holding its fermata on
		 * "triunfó", some two seconds behind a steady pace in all. Mixed down to
		 * mono, the trailing silence trimmed with a short fade.
		 *
		 * No intro: the band starts on the chorus, as the official score does.
		 */
		instrument: {
			hash: 'a7dffc14fdc5',
			intro: 0,
		},
		score: {
			/*
			 * A major, 132 beats of 2/4: the 16-bar chorus, the 34-bar first stanza
			 * and the chorus again, as the score's D.C. al Fin has it. The voice
			 * line of the 1947 official edition's reduction for voice and piano,
			 * from the Biblioteca Nacional de Venezuela's volume on IMSLP (CC BY
			 * 3.0, credited in README.md; see midi/README.md), the top voice where
			 * the chorus splits. The fermata on "triunfó" is held three beats
			 * rather than two, as the library's own MIDI plays it.
			 *
			 * **A is the official score's key**, chosen by ear over B♭, where the
			 * Navy Band plays it: its pitch classes correlate with B♭ major at
			 * 0.94 against 0.80 for any other key, its last chord is on B♭, and the
			 * melody fits a semitone up at 0.141, lowered by the ritardando and the
			 * held fermata.
			 *
			 * Tempo 88, from the edition's printed Allegro marcial, ♩ = 84–92,
			 * chosen by ear over 84 and 92.
			 */
			tempo: 88,
			key: 'A major',
			hash: 'a3dd171eae87',
		},
		// Landaeta set Salias's words around 1810, in the first years of the
		// struggle for independence. Antonio Guzmán Blanco decreed it the anthem
		// on 25 May 1881, and the official edition of 1947 fixed its words and
		// music.
		composed: '1810',
		adopted: '1881-05-25',
	},
}
