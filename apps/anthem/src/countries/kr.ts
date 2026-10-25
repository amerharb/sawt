import { Country } from './Country'

export const kr: Country = {
	code: 'kr',
	name: {
		en: 'South Korea',
		ar: 'كوريا الجنوبية',
		de: 'Südkorea',
		el: 'Νότια Κορέα',
		sv: 'Sydkorea',
		th: 'เกาหลีใต้',
		tr: 'Güney Kore',
		zh: '韩国',
	},
	flag: '🇰🇷',
	nativeLanguage: 'ko',
	anthem: {
		nativeName: '애국가',
		name: {
			en: 'Patriotic Song',
		},
		// Verse 1 and the refrain, which is what all three recordings sing or
		// play; the other three verses each close on the same refrain. The
		// words are by an unknown author, printed by 1908 — credited to Yun
		// Chi-ho (died 1945) or Ahn Chang-ho (died 1938) — and the spacing is
		// the government's (화려 강산).
		lyrics: ['ko'],
		// No intro: the band starts on the tune's first note. United States Navy
		// Band, public domain; mixed down to mono and the second of near-silence
		// at its end trimmed with a short fade.
		instrument: {
			hash: '50c164e043d7',
			intro: 0,
		},
		score: {
			/*
			 * A♭ major, 64 beats: an 8-bar verse and an 8-bar refrain of 4/4,
			 * closing on the same four bars, no pickup. Read from the choir's
			 * soprano in the government's 2018 full score, which sets it in A, and
			 * checked note by note against the sheet on nationalanthems.info in G
			 * (both credited in README.md; see midi/README.md).
			 *
			 * **A♭ is measured from the recording**: the melody fits best a
			 * semitone below the 2018 score — 0.200 against 0.146 for the next key
			 * — and the held notes agree from their fundamentals, B♭ under "록",
			 * A♭ under the last "세".
			 *
			 * Neither score prints a tempo — Andante molto maestoso, 느리고
			 * 장중하게 — so 70 is chosen by ear from 64, 70 and 76: the band's own
			 * pace, about 69.5. The choir takes it at about 64.5.
			 */
			// The melody file opens with the 2018 score's four-bar intro, read from
			// the flute an octave down, before the empty line: the verse's first
			// phrase, rising to the dominant. The 2/4 bar of timpani roll and
			// cymbal in front of it is not written.
			tempo: 70,
			key: 'Ab major',
			hash: '11e616ed849d',
			introType: 'prelude',
		},
		/*
		 * The Seoul Metropolitan Chorus with the Seoul Philharmonic Orchestra,
		 * 「2018 애국가(합창)」 from Gongu, a donated free-use work credited in
		 * README.md. The recording is all four verses in 4:21; this is the intro,
		 * verse 1 and the refrain, cut in the 0.3 s breath before verse 2, with
		 * the 0.8 s of silence at its head trimmed. In A major at about 64.5, a
		 * semitone above the band.
		 *
		 * The intro is the roll and the four-bar prelude; it ends at 16.9 s, in
		 * the breath before the choir comes in at 17.0.
		 */
		choral: {
			hash: 'ae194a88add6',
			intro: 16.9,
			introType: 'prelude',
		},
		// Ahn Eak-tai wrote the tune in 1935, the words having been sung to "Auld
		// Lang Syne" until then; it became the anthem with the government in
		// August 1948.
		composed: '1935',
		adopted: '1948-08',
	},
}
