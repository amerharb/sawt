import { Country } from './Country'

export const ca: Country = {
	code: 'ca',
	name: {
		en: 'Canada',
		ar: 'كندا',
		de: 'Kanada',
		el: 'Καναδάς',
		sv: 'Kanada',
		th: 'แคนาดา',
		tr: 'Kanada',
		zh: '加拿大',
	},
	flag: '🇨🇦',
	nativeLanguage: 'en',
	anthem: {
		nativeName: 'O Canada',
		name: {
			en: 'O Canada',
		},
		// Two sets of words, as the Vatican has — but these are two languages of
		// one country rather than two versions of one text, and neither is a
		// translation of the other. Weir's English of 1908, whose third line was
		// changed from "in all thy sons command" by an Act of Parliament in 2018,
		// and Routhier's French of 1880, which came first. Nine lines each.
		lyrics: ['en', 'fr'],
		/*
		 * No intro. Every instrumental recording of this anthem on Commons was
		 * checked — the Naval Reserve's, the US Navy Band's, the Third Marine
		 * Aircraft Wing Band's — and none opens with a fanfare. The level cannot
		 * settle it on its own, because these are compressed enough that an intro
		 * would play as loud as the tune, so the score was slid against each
		 * recording's harmony instead: the melody lands between 1.8 and 3.3 s in
		 * all three, which leaves no room for one.
		 */
		instrument: {
			hash: '71aff9e81115',
			intro: 0,
		},
		score: {
			// E flat major, 28 bars of 4/4, 112 beats. From the LilyPond block on
			// es.wikipedia — a single voice, where the English edition sets the
			// same tune in four parts — which is written in F. Both bands play in
			// E flat, and a CC0 piano rendering on Commons calls E flat "its
			// traditional key", so the notes are two semitones down from the page.
			// Tempo 100 is the score's own marking and is kept; the band takes
			// about 73 s including its tail, against the score's 67.
			tempo: 100,
			key: 'Eb major',
			hash: '786ecbafa587',
		},
		// Lavallée set Routhier's words in 1880 for a Saint-Jean-Baptiste Day
		// banquet in Quebec City; it waited a century to become official
		composed: '1880',
		adopted: '1980-07-01',
	},
}
