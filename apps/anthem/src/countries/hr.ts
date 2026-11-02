import { Country } from './Country'

export const hr: Country = {
	code: 'hr',
	name: {
		en: 'Croatia',
		ar: 'كرواتيا',
		de: 'Kroatien',
		el: 'Κροατία',
		sv: 'Kroatien',
		th: 'โครเอเชีย',
		tr: 'Hırvatistan',
		zh: '克罗地亚',
	},
	flag: '🇭🇷',
	nativeLanguage: 'hr',
	anthem: {
		nativeName: 'Lijepa naša domovino',
		name: {
			en: 'Our Beautiful Homeland',
		},
		// Verse 1: the first two of the four quatrains in article 16 of the anthem
		// law, Narodne novine 55/1990, which one pass of the music carries and
		// which is usually all that is sung. Mihanović's words (he died in 1861)
		// in the law's wording, an official text. Article 6 makes using the
		// anthem free for educational purposes, so long as it does not harm the
		// country's reputation and dignity.
		lyrics: ['hr'],
		// No intro: the band starts on the first note. United States Navy Band,
		// public domain, from the band's own MP3 of 2004 as archived from its
		// site: one verse, the first half at about 71 and the second at about 67,
		// the last note held. Mixed down to mono, the near-silence at its end
		// trimmed with a short fade. Commons' 117 s "both stanzas" file is this
		// recording joined to itself, not a performance of its own.
		//
		// No 🎤 or 👥: Commons has no sung recording, and its one other, a 23 s
		// fragment from about 1918, is a 78.
		instrument: {
			hash: 'e32dc6e97234',
			intro: 0,
		},
		score: {
			/*
			 * B♭ major, 64 beats: 16 bars of 4/4, no pickup, one verse. Taken from
			 * Peter Gerloff's CC0 MIDI on Commons, in B♭ (see midi/README.md), and
			 * checked note for note against the score the anthem law prints in
			 * article 17, a single voice line in C marked Svečano — an official
			 * text, without copyright.
			 *
			 * **B♭ is measured from the recording**: the MIDI's own key fits at
			 * 0.179 against 0.138 for any other, and the held F and B♭ come back
			 * from their fundamentals.
			 *
			 * The law prints no number; 72, about the band's first half, is chosen
			 * by ear from 66, 72 and 80.
			 */
			tempo: 72,
			key: 'Bb major',
			hash: 'c4927ca1ab19',
		},
		// Mihanović's poem was printed in 1835 and Runjanin set it in 1846. It
		// became Croatia's own anthem on 29 February 1972, as Socialist Croatia's,
		// and the constitution and the anthem law of December 1990 carried it on.
		composed: '1846',
		adopted: '1972-02-29',
	},
}
