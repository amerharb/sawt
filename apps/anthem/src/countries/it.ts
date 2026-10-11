import { Country } from './Country'

export const it: Country = {
	code: 'it',
	name: {
		en: 'Italy',
		ar: 'إيطاليا',
		de: 'Italien',
		el: 'Ιταλία',
		sv: 'Italien',
		th: 'อิตาลี',
		tr: 'İtalya',
		zh: '意大利',
	},
	flag: '🇮🇹',
	nativeLanguage: 'it',
	anthem: {
		nativeName: 'Il Canto degli Italiani',
		name: {
			en: 'The Song of the Italians',
		},
		// Mameli died 1849, so the words are public domain. The first stanza
		// and the Stringiamci refrain — the part protocol sings — carved from
		// his full poem on Wikisource; see tools/fetch-lyrics.py
		lyrics: ['it'],
		// 0.77 s earlier than it used to read: 0.38.0 cut that much dead air
		// off the head of the recording
		instrument: {
			hash: 'e098c534afb5',
			intro: 23.73,
			introType: 'prelude',
		},
		score: {
			/*
			 * The voice line of Maurizio Benedetti's revision of Novaro's score,
			 * as nationalanthems.info carries it (two pages, CC BY 4.0; see
			 * midi/README.md): from the pickup into bar 14 to "chia-mò" in bar 47,
			 * 133.5 beats. Bars 1–11 are the introduction, which the 23.73 s
			 * above cuts: the voice's pickup lands at 24.1 s.
			 *
			 * Two keys, both as written: the verse in B♭, bars 13–29, and from
			 * bar 31 the Allegro mosso in E♭ — the verse again, pianissimo, then
			 * "Stringiamci a coorte" twice. A slope-limited time-warping fit of
			 * the whole score against the band places both pages at no shift.
			 * Bars 29–30 are an instrumental bridge, so the voice rests 8.75
			 * beats there, as the sheet has it.
			 *
			 * Page two agrees note for note with the LilyPond on en.wikipedia;
			 * page one was read from the sheet and its first four bars agree with
			 * the LilyPond on it.wikipedia in pitch. Where they differ in rhythm —
			 * the D held two beats in bars 16 and 20 — the sheet is followed. The
			 * closing "sì!" is a shout on an x notehead, unpitched, and is not
			 * written; the Quirinale has dropped it since December 2025 anyway.
			 *
			 * Tempo 124: the sheet prints none, and the band takes page one at
			 * 120 and page two at 126, as the "accelerando sino alla fine" asks.
			 */
			tempo: 124,
			key: 'Bb major',
			hash: '775b629d2575',
		},
	},
}
