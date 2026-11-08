import { Country } from './Country'

export const az: Country = {
	code: 'az',
	name: {
		en: 'Azerbaijan',
		ar: 'أذربيجان',
		de: 'Aserbaidschan',
		el: 'Αζερμπαϊτζάν',
		sv: 'Azerbajdzjan',
		th: 'อาเซอร์ไบจาน',
		tr: 'Azerbaycan',
		zh: '阿塞拜疆',
	},
	flag: '🇦🇿',
	nativeLanguage: 'az',
	anthem: {
		nativeName: 'Azərbaycan marşı',
		name: {
			en: 'March of Azerbaijan',
			tr: 'Azerbaycan Marşı',
		},
		// The official text as the president's site prints it, after citing the
		// constitutional law of 2 November 2018 that approves it: eighteen lines,
		// shaped by hand into the four stanzas Azerbaijani Wikisource sets (see
		// fetch-lyrics.py). Both laws name Ahmad Javad, who was executed in 1937;
		// some scholars give the words to Jamo bey Jabrayilbeyli, who died in
		// 1965, as they were first printed in 1919 over "Cəmo bəy". Uzeyir
		// Hajibeyov died in 1948. Azerbaijan's copyright law leaves state symbols,
		// the anthem among them, outside copyright, and the 2019 law on its use
		// restricts only singing it in another language and distorting it.
		lyrics: ['az'],
		/*
		 * The United States Navy Band, public domain: the only free instrumental
		 * recording, its three files on Commons being one tape. G minor, a fourth
		 * above the official D minor, at about 69, broadening to about 66 from
		 * "Namusunu hifz etməyə" on. Mixed down to mono, the trailing silence
		 * trimmed with a short fade.
		 *
		 * The intro is the official score's two bars of introduction: a timpani
		 * roll on G, a crash on the score's sforzando chord, then the band's held
		 * chord, which makes it a fanfare rather than a drum intro. The cut at
		 * 7.7 s is by ear; fitting the melody puts its first note there too.
		 */
		instrument: {
			hash: '60762a271b58',
			intro: 7.7,
			introType: 'fanfare',
		},
		score: {
			/*
			 * D minor, 140½ beats: 34 bars of 4/4 with no pickup, the voice line of
			 * the official score, bars 3–36, from the Presidential Library's book
			 * on the state symbols, an octave down. Read with the help of the
			 * engraving on nationalanthems.info (CC BY 4.0, credited in README.md;
			 * see midi/README.md): the two agree on every pitch and differ in
			 * rhythm in seven bars, where the official score's dotted figures and
			 * longer held ends are kept. Its two opening bars are a roll and a
			 * chord with the voice resting, so there is no melody intro.
			 *
			 * **D minor is the official key**, and the choral recording's: it fits
			 * there at 0.161 against 0.126 for any other key, over a held D. Chosen
			 * by ear over G minor, where the Navy Band plays it, fitting at 0.173
			 * against 0.132 and sounding its roll and chords on G.
			 *
			 * No tempo is printed anywhere; 69, the Navy Band's pace, chosen by ear
			 * from 66, 69 and 72.
			 */
			tempo: 69,
			key: 'D minor',
			hash: '43dce5501598',
		},
		/*
		 * The Government of Azerbaijan's recording, the anthem file on the
		 * president's official site, whose about page puts everything on it under
		 * CC BY 4.0 (credited in README.md): Aydın Əzimov's arrangement for large
		 * choir and symphony orchestra, made in 1989 and approved with the anthem
		 * in 1992. D minor at about 67, broadening as the band does. Mixed down to
		 * mono and raised 9.5 dB to the app's level; it ends on its held last
		 * chord, where the file stops.
		 *
		 * The intro is the orchestra's swell on D; the cut at 4.6 s sits in the
		 * breath before the choir comes in.
		 */
		choral: {
			hash: '02c151c26875',
			intro: 4.6,
			introType: 'fanfare',
		},
		// Hajibeyov set the poem in 1919, the year it was first printed, as "Vətən
		// marşı". The republic of 1918–20 called for an anthem in a competition
		// that its fall in April 1920 cut short; the march was adopted by the law
		// of 27 May 1992, and a constitutional law of 2 November 2018 approved its
		// words and music again.
		composed: '1919',
		adopted: '1992-05-27',
	},
}
