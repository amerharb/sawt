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
		/*
		 * No `score`. There is no notation to be found for this anthem anywhere,
		 * and Iran is also the one country here where writing the melody out
		 * would be reproducing a composition still in its own term — everywhere
		 * else the copyright question has been about the engraving a tune was
		 * read from, never the tune itself. So 🎺, 🥁🎺, and 🥁 from the moment
		 * above.
		 */
		// Hassan Riyahi's setting, written in 1988 and adopted two years later
		composed: '1988',
		adopted: '1990',
	},
}
