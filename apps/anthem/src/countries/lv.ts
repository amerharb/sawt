import { Country } from './Country'

export const lv: Country = {
	code: 'lv',
	name: {
		en: 'Latvia',
		ar: 'لاتفيا',
		de: 'Lettland',
		el: 'Λετονία',
		sv: 'Lettland',
		th: 'ลัตเวีย',
		tr: 'Letonya',
		zh: '拉脱维亚',
	},
	flag: '🇱🇻',
	nativeLanguage: 'lv',
	anthem: {
		nativeName: 'Dievs, svētī Latviju!',
		name: {
			en: 'God Bless Latvia!',
		},
		// The anthem law's own text, article 2, in the two quatrains its annex score
		// numbers, with the law's commas — written out by hand like Slovakia's (see
		// fetch-lyrics.py). Baumanis died in 1905, and Latvian copyright law puts
		// state anthems outside copyright besides. The law asks for the approved
		// words and music, allows the anthem at public events in solemn conditions,
		// and fines only flagrant disrespect.
		lyrics: ['lv'],
		// No intro: the band starts on the first note. United States Navy Band,
		// public domain, recorded in 1995: the whole anthem, each half twice, the
		// first at a steady 76 and the second at about 72, the last note held.
		// B♭ major, one of the keys Cabinet regulation No. 14 sets for bands and
		// orchestras. Mixed down to mono, the near-silence at its end trimmed with
		// a short fade.
		//
		// No 🎤 or 👥: the only other recording on Commons, the army staff band's,
		// is instrumental and was copied from YouTube.
		instrument: {
			hash: '2cc4faf2826a',
			intro: 0,
		},
		score: {
			/*
			 * B♭ major, 128 beats: 4/4, two halves of eight bars, each sung twice.
			 * The engraved sheet on Commons, public domain, in F major, marked
			 * Majestically; the law's annex score, a four-part choir setting in A♭,
			 * has the same form but is too blurred to read note by note (see
			 * midi/README.md).
			 *
			 * **B♭ is measured from the recording**: a fourth above the sheet fits
			 * at 0.178 against 0.146 for any other key, and the held notes agree
			 * from their fundamentals, B♭ where the sheet has F and F where it has
			 * C, the last note included. The first half follows the reading within
			 * 0.16 s at 76, the second at 72. B♭ is chosen by ear over F, the key
			 * regulation No. 14 gives a single voice line.
			 *
			 * Neither score prints a number; 72, the band's second half, is chosen by
			 * ear from 68, 72 and 76.
			 */
			tempo: 72,
			key: 'Bb major',
			hash: '8641ab094aad',
		},
		// Baumanis wrote words and music in 1873. It became the anthem on 7 June
		// 1920 and was restored on 15 February 1990.
		composed: '1873',
		adopted: '1920-06-07',
	},
}
