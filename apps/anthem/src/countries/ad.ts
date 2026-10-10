import { Country } from './Country'

export const ad: Country = {
	code: 'ad',
	name: {
		en: 'Andorra',
		ar: 'أندورا',
		de: 'Andorra',
		el: 'Ανδόρρα',
		sv: 'Andorra',
		th: 'อันดอร์รา',
		tr: 'Andorra',
		zh: '安道尔',
	},
	flag: '🇦🇩',
	nativeLanguage: 'ca',
	anthem: {
		nativeName: 'El gran Carlemany',
		name: {
			en: 'The Great Charlemagne',
		},
		// Three stanzas of four lines, in the old orthography Andorra still uses.
		// Benlloch, Bishop of Urgell and so one of Andorra's two co-princes, wrote
		// them; he died in 1926 and Marfany in 1942, so both are clear.
		lyrics: ['ca'],
		// Marfany set Benlloch's words for the feast of Our Lady of Meritxell, and
		// Andorra adopted them that same day.
		// intro: the band holds a chord on the dominant, A over D, for 4.4 s and
		// plays six quick repeated notes; the tune's pickup enters at 5.44 s,
		// placed by fitting the sheet below, and the cut at 5.4 was chosen by ear
		instrument: {
			hash: 'b536deddb82a',
			intro: 5.4,
			introType: 'fanfare',
		},
		score: {
			/*
			 * G major, 104 beats — the treble staff of the piano score on
			 * nationalanthems.info (CC BY 4.0, credited in README.md; see
			 * midi/README.md): a triplet pickup and 26 bars of 4/4, played once
			 * through. It replaced nothing: the only earlier source, a Commons
			 * MIDI, fitted too weakly to write down.
			 *
			 * No transposition: the band plays it in G. A rigid fit across all
			 * twelve keys prefers G, and the final chord is G over a G bass.
			 * Fitted four bars at a time, each section starts where the one before
			 * ends.
			 *
			 * Tempo 115, chosen by ear: the sheet prints none, and the band takes
			 * bars 1–20 at 113 to 117 before broadening to about 108 for the close.
			 * The melody file has no intro part: the band's is a held chord, not a
			 * tune.
			 */
			tempo: 115,
			key: 'G major',
			hash: '1aa68061fe0f',
		},
		composed: '1921',
		adopted: '1921-09-08',
	},
}
