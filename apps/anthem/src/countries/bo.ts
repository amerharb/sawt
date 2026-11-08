import { Country } from './Country'

export const bo: Country = {
	code: 'bo',
	name: {
		en: 'Bolivia',
		ar: 'بوليفيا',
		de: 'Bolivien',
		el: 'Βολιβία',
		sv: 'Bolivia',
		th: 'โบลิเวีย',
		tr: 'Bolivya',
		zh: '玻利维亚',
	},
	flag: '🇧🇴',
	nativeLanguage: 'es',
	anthem: {
		nativeName: 'Himno Nacional de Bolivia',
		name: {
			en: 'National Anthem of Bolivia',
		},
		// The first stanza and the chorus, what is sung once through with the
		// music, from Spanish Wikisource (see fetch-lyrics.py). It differs from
		// the text in article 14 of Supreme Decree 241 of 2009 only in
		// punctuation. José Ignacio de Sanjinés died in 1864 and Leopoldo
		// Benedetto Vincenti in 1914. The decree forbids any use of the symbols
		// that does not give them "el valor cívico y el respeto que merecen"
		// (art. 42), and asks for at least two stanzas wherever the anthem is
		// sung (art. 16). It names no use outright, so Bolivia is in by that
		// call, as Ecuador is.
		lyrics: ['es'],
		/*
		 * The United States Navy Band, public domain: the only free recording.
		 * C major, the key of the 1943 official edition, at a steady 98: the
		 * introduction, the first stanza and the chorus, broadening a little at
		 * the end. Mixed down to mono, the trailing silence trimmed with a short
		 * fade.
		 *
		 * The intro is the band's four bars and the chords under the singers'
		 * rest, 11 s. The cut at 11.4 s sits in the silence before the stanza's
		 * pickup lands at 11.48 s.
		 */
		instrument: {
			hash: 'a6dad7895503',
			intro: 11.4,
			introType: 'prelude',
		},
		score: {
			/*
			 * C major, 126 beats of 4/4: the stanza from its pickup, turning to
			 * flats at "Al estruendo marcial", then the chorus. The voice line of
			 * the Ministry of Education's 1943 official edition for voice and
			 * piano, from IMSLP, public domain (see midi/README.md). The scan is
			 * warped, so each staff was straightened before its notes were read.
			 *
			 * **C is measured from the recording**: the melody fits there at
			 * 0.188 against 0.111 for any other key, the band following it within
			 * 0.16 s through the stanza and half a second behind by the chorus's
			 * end.
			 *
			 * The edition marks only Marcial; 98, the band's pace, chosen by ear
			 * over 92 and 104.
			 */
			tempo: 98,
			key: 'C major',
			hash: 'cf48dc5fe2ec',
		},
		// Vincenti's music was first played in La Paz on 18 November 1845, and
		// President Belzu made it the national anthem in 1851.
		composed: '1845',
		adopted: '1851',
	},
}
