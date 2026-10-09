import { Country } from './Country'

export const ir: Country = {
	code: 'ir',
	name: {
		en: 'Iran',
		ar: 'إيران',
		de: 'Iran',
		el: 'Ιράν',
		sv: 'Iran',
		th: 'อิหร่าน',
		tr: 'İran',
		zh: '伊朗',
	},
	flag: '🇮🇷',
	nativeLanguage: 'fa',
	anthem: {
		nativeName: 'سرود ملی جمهوری اسلامی ایران',
		name: {
			en: 'National Anthem of the Islamic Republic of Iran',
		},
		/*
		 * The one real event in the opening: the band falls thirteen decibels at
		 * 6.8 s and is back inside a fifth of a second. Everything before it is a
		 * dip of two or three against a body sitting at −17, which is what this
		 * recording is like throughout — fourteen decibels from floor to peak
		 * where a Navy Band tape has twenty-five. Six earlier candidates were cut
		 * and listened to before this one was kept.
		 */
		intro: 6.8,
		/*
		 * Seven lines, and unusually the whole anthem — no second stanza and no
		 * refrain. The public-domain claim behind them is the softest in this
		 * app: not a dead poet but article 16 of Iran's 1970 act, which frees a
		 * legal entity's work thirty years after publication, the anthem having
		 * been adopted in 1990. It is the same ground on which Commons hosts the
		 * recording above. `tools/fetch-lyrics.py` writes out where it is weak —
		 * if the words are Bagheri's own rather than the state's, the term is his
		 * life plus fifty and the claim fails — rather than leaving the next
		 * reader to assume it is settled.
		 */
		lyrics: ['fa'],
		score: {
			/*
			 * A♭ major, 61 beats — the tune from the pickup into bar 3 to the end,
			 * read from Sid Dabir's two-staff sheet on nationalanthems.info
			 * (CC BY 4.0; see midi/README.md), the top staff, 17 bars of 4/4 in F.
			 * Bars 1–2 are a fanfare on one repeated note, and they are this
			 * recording's introduction: from bar 4 every bar of the band takes
			 * 3.0 s, which puts the pickup at 6.95 s, just after the 6.8 s cut
			 * above. So 🎼 starts where 🎺 does.
			 *
			 * **Transposed up a minor third**, F → A♭, to the band. Aligned by
			 * time-warping a rendering of the sheet against the recording in all
			 * twelve keys, A♭ costs 0.305 where no other key comes under 0.40, and
			 * the final chord is A♭–C–E♭.
			 *
			 * Tempo 80, measured: the sheet prints none, and the band's bars from
			 * 4 to 17 are each 3.0 s.
			 *
			 * Until 2026 Iran had no 🎼, and the reason given was the composition
			 * rather than the missing notation: Riyahi's 1988 setting is in its
			 * own term if it is his. It is carried now on the ground the words
			 * and the recording already stand on — article 16 of Iran's 1970 act,
			 * which frees a legal entity's work thirty years after publication —
			 * and fails with them if the music turns out to be his own work
			 * rather than the state's.
			 */
			tempo: 80,
			melody:
				'Eb4/0.75 Eb4/0.25 Ab4/1.5 G4/0.5 F4/1 G4/0.5 Ab4/0.5 G4/1.5 ' +
				'F4/0.5 Eb4/0.75 F4/0.25 G4/0.5 Ab4/0.5 Bb4/0.5 C5/0.5 Db5/1 ' +
				'C5/1 Ab4/0.75 C5/0.25 Bb4/3 F5/1 F5/1.5 Eb5/0.5 Db5/0.5 ' +
				'C5/0.5 Bb4/0.75 Ab4/0.25 Ab4/1.5 Eb4/0.5 Ab4/0.5 Bb4/0.5 C5/0.75 ' +
				'Db5/0.25 C5/1 Bb4/0.5 Ab4/0.5 Bb4/1 Eb5/0.5 F5/0.5 Eb5/1 ' +
				'Db5/0.5 C5/0.5 Bb4/1.75 Ab4/0.25 Ab4/3 Bb4/0.5 C5/0.5 Db5/1.5 ' +
				'C5/0.5 Db5/0.5 Eb5/0.5 Db5/0.5 C5/0.5 Db5/0.5 C5/0.5 Bb4/0.5 ' +
				'Ab4/0.5 Bb4/1.5 Eb5/0.5 Bb4/1 C5/0.5 Db5/0.5 Eb5/1.5 F5/0.5 ' +
				'Eb5/0.5 Db5/0.5 C5/0.75 Bb4/0.25 Ab4/1.5 Eb4/0.5 Ab4/0.5 Bb4/0.5 ' +
				'C5/0.5 Db5/0.5 C5/1 Bb4/0.5 Ab4/0.5 Bb4/2 Ab4/2',
		},
		// Hassan Riyahi's setting, written in 1988 and adopted two years later
		composed: '1988',
		adopted: '1990',
	},
}
