import { Country } from './Country'

export const bg: Country = {
	code: 'bg',
	name: {
		en: 'Bulgaria',
		ar: 'بلغاريا',
		de: 'Bulgarien',
		el: 'Βουλγαρία',
		sv: 'Bulgarien',
		th: 'บัลแกเรีย',
		tr: 'Bulgaristan',
		zh: '保加利亚',
	},
	flag: '🇧🇬',
	nativeLanguage: 'bg',
	anthem: {
		nativeName: 'Мила Родино',
		name: {
			en: 'Dear Motherland',
		},
		// Radoslavov's first verse and chorus (he died in 1931), which since 12
		// July 1991 are the whole of the anthem, from Bulgarian Wikisource. The
		// verses added in 1964 — Georgi Dzhagarov's (he died in 1995) and Dimitar
		// Metodiev's — are not part of it now and are not free, so they are left.
		lyrics: ['bg'],
		/*
		 * The United States Navy Band's own recording of 2003, public domain,
		 * complete: a drum roll, the verse and the chorus twice at about 64,
		 * then the music again for the 1964 second verse with the chorus once at
		 * about 60 — chosen by ear over a one-pass cut in the breath at 71.35 s.
		 * Mixed down to mono, the near-silence at its end trimmed with a short
		 * fade.
		 *
		 * The intro is the roll, cut at 5.7 s on the band's first chord, chosen
		 * by ear over 5.5 s. A drum intro, so the melody has none.
		 *
		 * No 🎤 or 👥: the parliament's sung recording on Commons is tagged with
		 * an exemption that covers laws, ideas, folklore and facts, not a choir's
		 * recording.
		 */
		instrument: {
			hash: 'd5e244a2620d',
			intro: 5.7,
			introType: 'drum',
		},
		score: {
			/*
			 * F minor, 71 beats: 3/4, an 8-bar verse and a 7-bar chorus sung twice,
			 * the first time closing on a bar of 2/4 that runs back into it. The
			 * simple engraved sheet on Commons, public domain, in A minor, marked
			 * Solemn, moderately slow; a choir-and-piano score there agrees note
			 * for note but gives the run into the chorus to the piano (see
			 * midi/README.md).
			 *
			 * **F minor is measured from the recording**: a major third below the
			 * sheet fits at 0.202 against 0.126 for any other key, and the held
			 * notes agree from their fundamentals, F where the sheet has A and C
			 * where it has E. Both of the band's passes follow the reading within
			 * 0.22 s but for the first pass's last bars, a third of a second slow.
			 *
			 * Tempo 66, the choir score's printed ♩ = 66, chosen by ear from 60, 66
			 * and 72; the band's own pace is about 64.
			 */
			tempo: 66,
			key: 'F minor',
			hash: '215f9f3e7f5e',
		},
		// Radoslavov wrote the song in 1885, leaving for the Serbo-Bulgarian War.
		// A decree made it the anthem on 8 September 1964, with Philip Kutev's and
		// Alexander Raichev's harmony; it was cut back to the first verse and
		// chorus on 12 July 1991.
		composed: '1885',
		adopted: '1964-09-08',
	},
}
