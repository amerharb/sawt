import { Country } from './Country'

export const bd: Country = {
	code: 'bd',
	name: {
		en: 'Bangladesh',
		ar: 'بنغلاديش',
		de: 'Bangladesch',
		el: 'Μπανγκλαντές',
		sv: 'Bangladesh',
		th: 'บังกลาเทศ',
		tr: 'Bangladeş',
		zh: '孟加拉国',
	},
	flag: '🇧🇩',
	nativeLanguage: 'bn',
	anthem: {
		nativeName: 'আমার সোনার বাংলা',
		name: {
			en: 'My Golden Bengal',
		},
		// The song's first ten lines, which the constitution makes the anthem:
		// two stanzas of five, from the Gitabitan. Tagore wrote the words and the
		// tune and died in 1941; the tune follows Gagan Harkara's baul song, and
		// he died in 1910.
		lyrics: ['bn'],
		/*
		 * The government's own instrumental, from the Press Information
		 * Department, which puts its audio in the public domain: E♭ major, a
		 * steady 77, the whole anthem as sung with every repeat. Mixed down to
		 * mono. Chosen over the Navy Band's, which plays the same notes in A♭ at
		 * about 98, opening on the tune.
		 *
		 * The intro is the 8.8 s before the tune's pickup, cut in the dip just
		 * ahead of it.
		 */
		instrument: {
			hash: 'e3942ee7e894',
			intro: 8.8,
			introType: 'fanfare',
		},
		score: {
			/*
			 * E♭ major, 212½ beats of 6/8 counted in quarters — a two-eighth pickup,
			 * then the anthem with its repeats written out, as both recordings play
			 * it. The voice line of Johan Schoone's engraving (CC BY-SA 3.0,
			 * credited in README.md; see midi/README.md), transposed down a major
			 * third from G.
			 *
			 * **Three corrections to the engraving, each where both recordings
			 * agree against it**: C♯ for C♮ in the first high passage, as every
			 * later repeat has it; no extra tied bar on the low D in bar 40; and
			 * bar 61's phrase as the two bars it is each earlier time. With those,
			 * the official recording lines up within 0.1 s after its opening, and
			 * the Navy Band's within 0.7 s.
			 *
			 * Tempo 80, the engraving's ♪=160 in quarters, chosen by ear from 77,
			 * 80 and 98; the official recording takes 77.
			 */
			tempo: 80,
			key: 'Eb major',
			hash: 'ce95055ca81b',
		},
		/*
		 * The official vocal, from the Press Information Department like the
		 * instrumental, public domain as a recording: a choir, by ear. E♭ at 77,
		 * the same structure, mixed down to mono. Its intro is cut at the same
		 * 8.8 s.
		 */
		choral: {
			hash: 'bb0a66d238ff',
			intro: 8.8,
			introType: 'fanfare',
		},
		// The song is usually dated 1905, which the English Wikipedia calls
		// disputed. Independent Bangladesh's first cabinet adopted it on 13
		// January 1972, as nationalanthems.info has it; the provisional
		// government had taken it in April 1971, and the constitution of
		// December 1972 names it.
		composed: '1905',
		adopted: '1972-01-13',
	},
}
