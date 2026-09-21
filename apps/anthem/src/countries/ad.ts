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
		/*
		 * No 🎼, and no 🥁 either — both for the same reason.
		 *
		 * Commons has a public-domain MIDI (a user's own sequencing, not a
		 * published arrangement) whose first track is a monophonic 119-note line.
		 * It agrees with the recording on the key, G, which the file page states
		 * independently. But the fit is weak where every other score here is
		 * strong: r = 0.38 against 0.60 for China and 0.55 for Liberia, only two
		 * of the nine held notes measure the key from their fundamentals, and —
		 * the telling part — the MIDI's *bass* tracks score higher against the
		 * recording than its melody track does, which is what happens when the
		 * match is being made on harmony rather than on the tune. Not enough to
		 * write notes down on.
		 *
		 * The same fit puts the melody 4.97 s in, which would be an intro, but the
		 * level is flat across those five seconds and the fit is too weak to carry
		 * the claim alone. So neither is set. Both wait on a better source.
		 */
		// Marfany set Benlloch's words for the feast of Our Lady of Meritxell, and
		// Andorra adopted them that same day.
		composed: '1921',
		adopted: '1921-09-08',
	},
}
