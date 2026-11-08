import { Country } from './Country'

export const sk: Country = {
	code: 'sk',
	name: {
		en: 'Slovakia',
		ar: 'سلوفاكيا',
		de: 'Slowakei',
		el: 'Σλοβακία',
		sv: 'Slovakien',
		th: 'สโลวาเกีย',
		tr: 'Slovakya',
		zh: '斯洛伐克',
	},
	flag: '🇸🇰',
	nativeLanguage: 'sk',
	anthem: {
		nativeName: 'Nad Tatrou sa blýska',
		name: {
			en: 'Lightning over the Tatras',
		},
		// Both stanzas the anthem is, in the state-symbols act's own text: Annex 5
		// of Act 63/1993, four lines a stanza with its punctuation, written out by
		// hand like Puerto Rico's (see fetch-lyrics.py). Matúška died in 1877.
		// The act says the symbols may be used only in the manner it sets out and
		// lists ceremonial occasions, but forbids no other use outright.
		lyrics: ['sk'],
		// No intro: the band starts on the first note. United States Navy Band,
		// public domain, from the band's own MP3 as archived from its site: one
		// stanza at a steady 82, the last note held under the fermata. Mixed down
		// to mono, the near-silence at its end trimmed with a short fade.
		//
		// No 🎤 or 👥. The government's own recordings, one sung, came with no
		// terms of use; the copyright act's exemption for state symbols covers the
		// anthem, not a performance of it.
		instrument: {
			hash: 'a76d2b7b7c9c',
			intro: 0,
		},
		score: {
			/*
			 * G minor, 40 beats: 20 bars of 2/4, the second half sung twice with
			 * first and second endings, one stanza. The act's own score, Annex 5, a
			 * voice line marked Risoluto (♩ = 88) — an official text, without
			 * copyright (see midi/README.md).
			 *
			 * **G minor is measured from the recording**: the score's own key fits
			 * at 0.199 against 0.131 for any other, the held notes measure G, B♭
			 * and G from their fundamentals where the score has them, and the band
			 * follows the reading within 0.18 s throughout. Its last-note fermata is
			 * not written, 🎼 having one tempo.
			 *
			 * Tempo 88, the act's printed one; the band's own pace is 82.
			 */
			tempo: 88,
			key: 'G minor',
			hash: 'dbed594d5c4e',
		},
		// Matúška wrote the words in 1844, when Štúr's students left Bratislava in
		// protest, to a folk tune. The first stanza was half of Czechoslovakia's
		// anthem from 1918; the first two became Slovakia's on 1 January 1993.
		composed: '1844',
		adopted: '1993-01-01',
	},
}
