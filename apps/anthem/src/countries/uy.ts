import { Country } from './Country'

export const uy: Country = {
	code: 'uy',
	name: {
		en: 'Uruguay',
		ar: 'الأوروغواي',
		de: 'Uruguay',
		el: 'Ουρουγουάη',
		sv: 'Uruguay',
		th: 'อุรุกวัย',
		tr: 'Uruguay',
		zh: '乌拉圭',
	},
	flag: '🇺🇾',
	nativeLanguage: 'es',
	anthem: {
		nativeName: 'Himno Nacional de Uruguay',
		name: {
			en: 'National Anthem of Uruguay',
		},
		// The chorus once and the first stanza, the only stanza Uruguay sings,
		// in the Spanish article's text (see fetch-lyrics.py). It differs from
		// the 1845 printing the 1979 decree names only in modern accents,
		// capitals and punctuation. Francisco Acuña de Figueroa died in 1862 and
		// Francisco José Debali in 1859. The symbols decree of 18 February 1952
		// says the anthem may not be performed except whole, unless the Executive
		// authorizes it (art. 28 B, as the decree of 30 April 2002 quotes it). It
		// forbids no use outright, so Uruguay is in by that call, as Slovakia is.
		lyrics: ['es'],
		/*
		 * The United States Navy Band, public domain: the complete version of
		 * the three on its site, the short ones being cuts of this take. E♭
		 * major, Debali's key, at a steady 141: the introduction, the chorus,
		 * the first stanza at about 77, the introduction's last 20 s and the
		 * chorus again. The stanza stops at its pause after "también
		 * libertad", bar 27 of the 38 the score gives it, as the Uruguayan Army
		 * band's recording does too. Mixed down to mono, the trailing silence
		 * trimmed with a short fade.
		 *
		 * The intro is the anthem's orchestral introduction, 58 s. The cut at
		 * 58.4 s sits in the silence after it dies away, before the chorus's
		 * pickup lands at 58.47 s.
		 */
		instrument: {
			hash: 'db093d80a86a',
			intro: 58.4,
			introType: 'prelude',
		},
		score: {
			/*
			 * B♭ major, 427 beats: the 30-bar chorus from its pickup, a bar's
			 * rest, the stanza's 27 bars as the band plays them, and the chorus
			 * again. The voice line of a c. 1900 edition for voice and piano
			 * (Catálogo 846), from the Sibley Music Library's scan on IMSLP,
			 * public domain (see midi/README.md), the top voice where the chorus
			 * splits. The band's introduction, and its
			 * interlude before the second chorus, are not in the voice line.
			 *
			 * **B♭ is the decrees' key**, chosen by ear over E♭, Debali's key and
			 * the band's: the decree of 1934 moved the anthem to B♭ for singing,
			 * and the decree of 1979 holds every version to it. The edition is in
			 * E♭, where the melody fits the band at 0.206 against 0.119 for any
			 * other key. It is written a fourth lower here, B♭3 to D5.
			 *
			 * Tempo 144 is the 1979 decree's ♩ = 144 for the chorus; the band
			 * plays it at 141. The decree gives the stanza ♩ = 80, and a melody
			 * has one tempo, so the stanza's notes are written 1.8 times longer
			 * (144 ÷ 80).
			 */
			tempo: 144,
			key: 'Bb major',
			hash: '41f66574e28e',
		},
		// The music was first played on 18 July 1845, with the words Acuña de
		// Figueroa had reformed that year from his text of 1833. The decree of
		// 26 July 1848 made Debali's music the anthem's.
		composed: '1845',
		adopted: '1848-07-26',
	},
}
