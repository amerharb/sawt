import { Country } from './Country'

export const cl: Country = {
	code: 'cl',
	name: {
		en: 'Chile',
		ar: 'تشيلي',
		de: 'Chile',
		el: 'Χιλή',
		sv: 'Chile',
		th: 'ชิลี',
		tr: 'Şili',
		zh: '智利',
	},
	flag: '🇨🇱',
	nativeLanguage: 'es',
	anthem: {
		nativeName: 'Himno Nacional de Chile',
		name: {
			en: 'National Anthem of Chile',
		},
		// The fifth stanza and the chorus, the form decree 260 of 1990 has sung at
		// ceremonies, from the English Wikipedia (see fetch-lyrics.py); the chorus
		// is kept once, without its sung repeats. The stanza is Eusebio Lillo's
		// (he died in 1910), the chorus Bernardo de Vera y Pintado's (he died in
		// 1827), and Ramón Carnicer died in 1855. Decree 6476 of 1980 fixes the
		// official words and music and decree 260 the form sung at ceremonies;
		// neither limits other uses.
		lyrics: ['es'],
		/*
		 * The Government of Chile's official recording, orchestral, from its
		 * 2022–2026 digital kit: CC BY 3.0 Chile, credited in README.md. The
		 * introduction, the fifth stanza and the chorus, then a short closing, in
		 * C major, the key decree 6476 of 1980 sets, at about 107. Chosen by ear
		 * over the United States Navy Band's, public domain, which plays the same
		 * form three semitones higher. Mixed down to mono, the four seconds of
		 * silence at its end trimmed with a short fade.
		 *
		 * The intro is Carnicer's own introduction, which the decree sets at 126;
		 * the cut at 20.1 s sits in the breath before the first sung note,
		 * "Pu-ro".
		 */
		instrument: {
			hash: 'd27d026248cb',
			intro: 20.1,
			introType: 'prelude',
		},
		score: {
			/*
			 * C major, 182 beats: 4/4, a one-beat pickup, the 22-bar stanza with
			 * its triplets, and the 24-bar chorus with its repeats written out. The
			 * `Melody` track of the World Atlas MIDI of 1991, with the chorus
			 * corrected as decree 6476 of 1980 has it, read from Jo Hyo-roe's sheet
			 * on nationalanthems.info (CC BY 4.0, credited in README.md; see
			 * midi/README.md): the second voice is the melody in the chorus's bars
			 * 3–4 and 7–8, and "o el asilo contra la opresión" is sung the same all
			 * three times.
			 *
			 * **C is measured from the recording**: the file's own key fits at
			 * 0.136 against 0.111 for any other, and the held notes agree from
			 * their fundamentals, G where the stanza holds G and C for the last
			 * note. The stanza follows the reading closely in its first half; the
			 * orchestra takes its own time in the second, with held notes and a
			 * broader close, so the fit, 0.140 at 107.25, is lower than most.
			 *
			 * Tempo 108, the decree's for the stanza and chorus.
			 */
			tempo: 108,
			key: 'C major',
			hash: '28aad24148b4',
		},
		/*
		 * The same official recording with a choir, from the same kit and under
		 * the same licence: the introduction, the fifth stanza and the chorus, in
		 * C major at about 107.5. Mixed down to mono, the four seconds of silence
		 * at its end trimmed with a short fade.
		 *
		 * The intro is the same orchestral introduction; it ends at 19.7 s, in
		 * the breath before the choir comes in.
		 */
		choral: {
			hash: 'eef67b4c0555',
			intro: 19.7,
			introType: 'prelude',
		},
		// Carnicer wrote the music in London for Chile's minister there, Mariano
		// Egaña, most likely early in 1826: he left in the March, and it had been
		// sung in Santiago by September 1827, though 1828 is the year usually
		// given. It was presented officially in Santiago on 23 December 1828 and
		// replaced Manuel Robles's music of 1820; Lillo's words were first sung
		// with it on 17 September 1847.
		composed: '1826',
		adopted: '1828-12-23',
	},
}
