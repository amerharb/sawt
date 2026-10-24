import { Country } from './Country'

export const ro: Country = {
	code: 'ro',
	name: {
		en: 'Romania',
		ar: 'رومانيا',
		de: 'Rumänien',
		el: 'Ρουμανία',
		sv: 'Rumänien',
		th: 'โรมาเนีย',
		tr: 'Romanya',
		zh: '罗马尼亚',
	},
	flag: '🇷🇴',
	nativeLanguage: 'ro',
	anthem: {
		nativeName: 'Deșteaptă-te, române!',
		name: {
			en: 'Awaken Thee, Romanian!',
		},
		// The four stanzas the law has sung — 1, 2, 4 and 11 of Mureșanu's
		// eleven, Annex 3 of Law 75/1994 — in the law's wording, from the
		// English Wikipedia article. Mureșanu died in 1863 and Pann in 1854.
		lyrics: ['ro'],
		// No intro: the pickup comes at 0.13 s. United States Navy Band, public
		// domain, playing the music twice — the law has a band play it once, but
		// the two passes and the band's own ending were chosen by ear over a cut
		// at the end of the first. Mixed down to mono, the near-silence at its
		// end trimmed with a short fade.
		instrument: {
			hash: '713cdc04f77e',
			intro: 0,
		},
		score: {
			/*
			 * F minor, 120 beats: a one-beat pickup, 29 bars of 4/4 and a closing
			 * bar of three, one pass of the music, as the law has it played. Read
			 * from Annex 3 of Law 75/1994, the official score of the sung version,
			 * a single voice line in E minor — an official text, without
			 * copyright (see midi/README.md).
			 *
			 * **F minor is measured from the recording**: a semitone above the
			 * score fits at 0.196 against 0.130 for any other key, and the held
			 * notes agree from their fundamentals, C under the score's B and F
			 * under each E. Both of the band's passes line up within 0.22 s.
			 *
			 * The score prints only Tempo di marcia; 106, the band's own pace, is
			 * chosen by ear from 100, 106 and 112.
			 */
			tempo: 106,
			key: 'F minor',
			hash: '6c27c3183021',
		},
		// Mureșanu wrote the poem and Pann the tune in the revolution of 1848.
		// The decree-law of 24 January 1990 made it the anthem, and the
		// constitution of 1991 names it.
		composed: '1848',
		adopted: '1990-01-24',
	},
}
