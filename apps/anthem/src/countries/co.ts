import { Country } from './Country'

export const co: Country = {
	code: 'co',
	name: {
		en: 'Colombia',
		ar: 'كولومبيا',
		de: 'Kolumbien',
		el: 'Κολομβία',
		sv: 'Colombia',
		th: 'โคลอมเบีย',
		tr: 'Kolombiya',
		zh: '哥伦比亚',
	},
	flag: '🇨🇴',
	nativeLanguage: 'es',
	anthem: {
		nativeName: 'Himno Nacional de la República de Colombia',
		name: {
			en: 'National Anthem of the Republic of Colombia',
		},
		// The chorus and the first stanza, which is what the anthem is when sung,
		// in the official text the Spanish article gives (see fetch-lyrics.py);
		// the chorus is kept once, without its sung repeat. Rafael Núñez died in
		// 1894 and Oreste Síndici in 1904. The law on the national symbols and its
		// decree of 1991 ask for respect: they authorize the anthem at listed
		// occasions, punish outrage against it and allow it in advertising only
		// for patriotic messages, and forbid nothing else.
		lyrics: ['es'],
		/*
		 * The United States Navy Band, public domain: the only free recording.
		 * E♭ major, the key of Síndici's score and of the official arrangement,
		 * at a steady 102, in the whole ceremonial form: the introduction, the
		 * chorus, the first stanza, the introduction again and the chorus. Mixed
		 * down to mono, the trailing silence trimmed with a short fade.
		 *
		 * The intro is the anthem's band introduction, some 17 s; the cut at
		 * 17.9 s sits in the silence after its last chord, before the chorus's
		 * pickup lands at 18.05 s.
		 */
		instrument: {
			hash: '76e7d9def310',
			intro: 17.9,
			introType: 'prelude',
		},
		score: {
			/*
			 * E♭ major, 206 beats: 4/4, a one-beat pickup, the 18-bar chorus, the
			 * 16-bar first stanza and the chorus again, as the official score's
			 * D.C. al Fine has it. The soprano line of José Rozo Contreras's 1933
			 * arrangement for mixed choir, the version decree 1963 of 1946 made
			 * official, in the Biblioteca Nacional de Colombia's edition of 2007
			 * (CC BY 4.0, credited in README.md; see midi/README.md). Checked
			 * against the World Atlas MIDI of 1991, which differs in four places:
			 * it splits a tied note in two bars of the chorus's second half, has A
			 * for A♭ in "En surcos de dolores" the second time — the band plays A♭
			 * — and double-dots "La humanidad". The band's introduction is not in
			 * the voice line, nor is its repeat before the second chorus, so the
			 * melody has no intro and runs straight on.
			 *
			 * **E♭ is measured from the recording**: it fits at 0.235 against 0.133
			 * for any other key, and the band follows the melody within a quarter of
			 * a second from the first chorus to the last.
			 *
			 * The score is marked only Tempo di marcia; 102, the band's pace, chosen
			 * by ear over 108 and 112, the number on the MIDI and on a modern
			 * transcription.
			 */
			tempo: 102,
			key: 'Eb major',
			hash: '0eab6ef285a5',
		},
		// Síndici set Núñez's poem in 1887, and it was first sung in Bogotá on 11
		// November that year. Law 33 of 18 October 1920 made it the anthem, and
		// decree 1963 of 1946 the Rozo Contreras arrangement its official version.
		composed: '1887',
		adopted: '1920-10-18',
	},
}
