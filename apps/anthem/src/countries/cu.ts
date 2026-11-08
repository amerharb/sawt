import { Country } from './Country'

export const cu: Country = {
	code: 'cu',
	name: {
		en: 'Cuba',
		ar: 'كوبا',
		de: 'Kuba',
		el: 'Κούβα',
		sv: 'Kuba',
		th: 'คิวบา',
		tr: 'Küba',
		zh: '古巴',
	},
	flag: '🇨🇺',
	nativeLanguage: 'es',
	anthem: {
		nativeName: 'Himno de Bayamo',
		name: {
			en: 'Bayamo Anthem',
		},
		// The two stanzas that are the anthem, in Law 128 of 2019's own text
		// (article 50), which the Spanish article prints as it stands (see
		// fetch-lyrics.py). Perucho Figueredo wrote words and tune and was
		// executed in 1870. The law lets the anthem be played or sung as long as
		// its words and music are kept, forbids it in advertising, asks for
		// respect where the symbols appear in objects, art and writing, and
		// limits nothing else.
		lyrics: ['es'],
		/*
		 * The United States Navy Band, public domain: the full recording, which
		 * repeats the second stanza, chosen by ear over the Navy Band's abridged
		 * file, the same take with the repeat cut out. E♭ major at a steady 110.5.
		 * Mixed down to mono, the trailing silence trimmed with a short fade.
		 *
		 * The intro is Antonio Rodríguez Ferrer's introduction of 1898, which the
		 * law's score prints as part of the anthem; he died in 1935. The cut at
		 * 16.8 s sits in the silence after it dies away, before "Al com-" comes in
		 * at 16.94 s.
		 */
		instrument: {
			hash: '188c443e5600',
			intro: 16.8,
			introType: 'prelude',
		},
		score: {
			/*
			 * E♭ major, 95½ beats: a one-beat pickup, the first stanza, and the
			 * second stanza twice through its first and second endings, as the band
			 * plays it. The voice line of Jo Hyo-roe's sheet on nationalanthems.info
			 * (CC BY 4.0, credited in README.md; see midi/README.md), which agrees
			 * with the score printed in the law, a scan too blurred to read note by
			 * note. An older engraving on Commons stays low on "gloriosa" where the
			 * official version climbs to the high note, as the closing phrase does;
			 * the band plays the official version, fitting it at 0.202 against
			 * 0.194. Rodríguez Ferrer's introduction is not written as a melody
			 * intro.
			 *
			 * **E♭ is measured from the recording**, where the band follows the
			 * melody within a tenth of a second from the first note to the last;
			 * chosen by ear over D, the key of the law's own score.
			 *
			 * The law's score is marked only Marcial; 111, the band's pace, chosen
			 * by ear over 118 and 126, the sheet's number.
			 */
			tempo: 111,
			key: 'Eb major',
			hash: '2b93896b1ac0',
		},
		// Figueredo wrote the tune in August 1867; it was first played in
		// Bayamo's church on 11 June 1868 and sung with his words when Bayamo was
		// taken on 20 October 1868. The republic adopted it in 1902, and the law
		// of 2019 sets its words and music.
		composed: '1867-08',
		adopted: '1902',
	},
}
