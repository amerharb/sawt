import { Country } from './Country'

export const rs: Country = {
	code: 'rs',
	name: {
		en: 'Serbia',
		ar: 'صربيا',
		de: 'Serbien',
		el: 'Σερβία',
		sv: 'Serbien',
		th: 'เซอร์เบีย',
		tr: 'Sırbistan',
		zh: '塞尔维亚',
	},
	flag: '🇷🇸',
	nativeLanguage: 'sr',
	anthem: {
		nativeName: 'Боже правде',
		name: {
			en: 'God of Justice',
		},
		// The first two of the eight stanzas in article 34 of the anthem law,
		// Law 36/2009: Đorđević's words (he died in 1900) in the law's wording,
		// an official text. One pass of the music carries the two, and article
		// 37 allows them alone. The same article forbids any change to the words
		// or the melody, which the app keeps as written, and article 36 allows
		// the anthem in other uses not contrary to the law.
		lyrics: ['sr'],
		// No intro: the band starts on the first note. United States Navy Band,
		// public domain, playing the music twice — chosen by ear over a one-pass
		// cut in the breath between the passes, at 50.35 s. Mixed down to mono,
		// the near-silence at its end trimmed with a short fade.
		//
		// No 🎤 or 👥. The only sung candidate on Commons is a 2012 video filmed
		// in the stands at a handball match in the Belgrade Arena, whose
		// CC BY-SA licence covers the filming and not the performance; the other
		// recordings are 78s from about 1914 and 1918.
		instrument: {
			hash: '79649a93b6df',
			intro: 0,
		},
		score: {
			/*
			 * A♭ major, 79 beats: 4/4, a twelve-bar verse and a four-bar refrain
			 * sung twice, the second time with its own last bar, the final rest
			 * dropped. The soprano of the official score for mixed choir, which
			 * the government published in the Official Gazette no. 85/2010, in
			 * B♭ — an official text, without copyright (see midi/README.md).
			 *
			 * **A♭ is measured from the recording**: a whole tone below the score
			 * fits at 0.209 against 0.130 for any other key, and the held notes
			 * agree from their fundamentals, F where the score has G, E♭ where it
			 * has F and A♭ for its last B♭. Both of the band's passes follow the
			 * reading within 0.22 s, the first at 95.25 and the second at 96.5.
			 *
			 * The score prints only Andante maestoso; 96, about the band's own
			 * pace, is chosen by ear from 84, 90 and 96.
			 */
			tempo: 96,
			key: 'Ab major',
			hash: 'eaa4ff266bca',
		},
		// Jenko wrote the music in 1872 for Đorđević's play Markova sablja, and
		// it became the Kingdom of Serbia's anthem in 1882. Restored in 2004, it
		// is named in the constitution of 2006 and set out in the law of 2009.
		composed: '1872',
		adopted: '1882',
	},
}
