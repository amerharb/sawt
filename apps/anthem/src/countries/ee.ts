import { Country } from './Country'

export const ee: Country = {
	code: 'ee',
	name: {
		en: 'Estonia',
		ar: 'إستونيا',
		de: 'Estland',
		el: 'Εσθονία',
		sv: 'Estland',
		th: 'เอสโตเนีย',
		tr: 'Estonya',
		zh: '爱沙尼亚',
	},
	flag: '🇪🇪',
	nativeLanguage: 'et',
	anthem: {
		nativeName: 'Mu isamaa, mu õnn ja rõõm',
		name: {
			en: 'My Fatherland, My Happiness and Joy',
		},
		// The first of Jannsen's three stanzas, from Estonian Wikisource — the
		// one the band plays and the one usually sung. Jannsen died in 1890.
		lyrics: ['et'],
		// No intro: the pickup sounds at the very start. United States Navy Band,
		// public domain, playing one stanza and stopping, without the repeat of
		// lines 3–6 that Finland's plays. Mixed down to mono, the near-silence at
		// its end trimmed with a short fade.
		//
		// No 🎤 or 👥. The only sung recordings on Commons are 78 rpm transfers
		// from 1908 and 1927. Its "Official Instrumental Version" is a copy taken
		// from YouTube under a CC BY-SA tag its uploader does not seem able to
		// grant, so it is not used either.
		instrument: {
			hash: 'cbd58ea0c12f',
			intro: 0,
		},
		score: {
			/*
			 * D♭ major, 37.5 beats: 3/4 with a three-quaver pickup and 12 bars, one
			 * stanza. Read from the engraved sheet on Commons, public domain, in B♭
			 * major; a 1920 Estonian print, also on Commons, agrees but for a
			 * quaver rest in bar 8 where the engraving holds the note. Note for
			 * note it is the first stanza of Finland's melody, its last note held
			 * a beat longer (see midi/README.md).
			 *
			 * **D♭ is measured from the recording**: three semitones above the
			 * sheet fits at 0.232 against 0.150 for any other key, and the held
			 * notes agree from their fundamentals, F where the sheet has D and D♭
			 * where it has B♭, the last note included.
			 *
			 * Neither sheet prints a number — *Swiftly*, and *Hoogsasti* on the
			 * 1920 print; 80 chosen by ear from 73, 80 and 88, the band's own pace
			 * being about 73.
			 */
			tempo: 80,
			key: 'Db major',
			hash: '5d0544da72c6',
		},
		// Pacius wrote the tune in 1848 for Runeberg's Swedish poem, the one
		// Finland sings, and Jannsen's words were first sung to it at the first
		// Estonian song festival in 1869. Estonia made it the anthem in 1920 and
		// restored it in May 1990.
		composed: '1848',
		adopted: '1920',
	},
}
