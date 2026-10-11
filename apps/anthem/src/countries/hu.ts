import { Country } from './Country'

export const hu: Country = {
	code: 'hu',
	name: {
		en: 'Hungary',
		ar: 'المجر',
		de: 'Ungarn',
		el: 'Ουγγαρία',
		sv: 'Ungern',
		th: 'ฮังการี',
		tr: 'Macaristan',
		zh: '匈牙利',
	},
	flag: '🇭🇺',
	nativeLanguage: 'hu',
	anthem: {
		nativeName: 'Himnusz',
		name: {
			en: 'Hymn',
		},
		// Kölcsey's poem runs to eight stanzas and Hungary sings only the first —
		// the same shape as the Czech anthem, which is why the fetcher checks the
		// stanza count. Both author and composer died in the 1800s.
		lyrics: ['hu'],
		// A long orchestral introduction, and one that nearly went unnoticed: it is
		// built out of the anthem's own closing phrase, so the opening bars recur
		// late in the recording and look for all the world like a repeated strain
		// rather than an intro. What settled it was aligning the written score
		// against the audio — the first sung note lands here, and the notes at this
		// point read F4 Gb4 Ab4 Db5 Ab4, "Is-ten áldd meg a".
		instrument: {
			hash: '6b2d7f64c3b1',
			intro: 17.25,
			introType: 'prelude',
		},
		score: {
			// Db major, 64 beats — sixteen bars of 4/4, the whole anthem once.
			//
			// From the four-part LilyPond setting on en.wikipedia (taken from IMSLP
			// 306865), written in Eb; the melody is the soprano, transposed down two
			// semitones to the recording's Db. Three things agree, which is more
			// corroboration than any other score here has:
			//   - the Commons engraving `Himnusz kottája.png` is in Bb and opens
			//     D4 Eb4 F4 Bb4 — the same tune a fourth lower
			//   - the transposition was not chosen, it was measured: every best fit of
			//     score against recording independently landed on -2
			//   - the lone chromatic note, A4, is the one sharp the engraving shows,
			//     at "a-kit ré-gen tép"
			//
			// 59 is close to the measured 59.25, which ends the last bar at 82.1s
			// against 97.6s of music — the remainder being the closing rallentando,
			// so a constant-tempo fit reads a little fast. Chosen by ear.
			// The melody file opens with bars 1–4 of Erkel's piano score, the Andante
			// religioso before "a tempo", from the PWM edition on
			// nationalanthems.info, before the empty line. Three chords were unclear
			// at the top; the recording chose between the readings.
			tempo: 59,
			key: 'Db major',
			hash: 'cb827ca7183d',
			introType: 'prelude',
		},
		composed: '1844',
		// Erkel's setting won the 1844 competition and was treated as the anthem from
		// then on, but it had no legal standing until the 1989 constitutional
		// amendment named it. The later date is the adoption, as elsewhere here.
		adopted: '1989',
	},
}
