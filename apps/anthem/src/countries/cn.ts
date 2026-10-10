import { Country } from './Country'

export const cn: Country = {
	code: 'cn',
	name: {
		en: 'China',
		ar: 'الصين',
		de: 'China',
		el: 'Κίνα',
		sv: 'Kina',
		th: 'จีน',
		tr: 'Çin',
		zh: '中国',
	},
	flag: '🇨🇳',
	nativeLanguage: 'zh',
	anthem: {
		nativeName: '义勇军进行曲',
		name: {
			en: 'March of the Volunteers',
		},
		// No words on file. Nie Er's music is long out of copyright — he died in
		// 1935 — but Tian Han's text is a separate question: he died in 1968, which
		// frees it in China, where the term is life plus fifty, and not until 2039
		// where it is life plus seventy. The recording sidesteps it entirely, being
		// instrumental; Commons says so on the file page in as many words.
		/*
		 * 6.60 s, chosen by ear a hair ahead of where the two measurements put it.
		 *
		 * This is the one intro in the app that the score settles rather than the
		 * level. The published sheet sets its first system with no words under it —
		 * the singing begins at 起来 in the second — and Wikipedia's LilyPond
		 * encodes exactly that, opening its `\addlyrics` with twenty blank
		 * placeholders. So 起 falls on the twenty-second note, at beat 11.5 of the
		 * 74, which at 103.5 is 6.67 s. Fitting the tune alone against the
		 * recording, using no words at all, lands at 6.69 s: two methods with
		 * nothing in common agreeing to two hundredths of a second.
		 *
		 * 6.60 sits 70 ms before both, which is where it was wanted by ear — a
		 * boundary is better a little early than a little late, since landing late
		 * clips the first syllable.
		 */
		instrument: {
			hash: 'f15a26f21b4c',
			intro: 6.60,
			introType: 'fanfare',
		},
		score: {
			/*
			 * G major, 62.5 beats — the tune, without the 11.5-beat introduction,
			 * which is the shape every other score here takes.
			 *
			 * **The best-measured country in the app.** Nothing is transposed, the
			 * Navy Band playing in the score's own G, and five of the six notes held
			 * two beats or more come back at exactly 0 semitones from their
			 * fundamentals — +0.09, −0.02, +0.04, +0.02, +0.03, median +0.03. The
			 * alignment holds across the whole piece to within 0.09 s, checked in
			 * quarters. Tempo 103.5 is a sharp peak: 0.60 there against 0.45 at 102
			 * and 0.46 at 105.
			 *
			 * **The first score here with triplets.** The source writes them
			 * `\times 2/3 {d'8 d d}`, three notes in the time of two eighths, which
			 * come out as 0.3333. Summed, the tune is 62.4998 beats against the
			 * written 62.5.
			 *
			 * Begins on the pickup that carries 起, which is why the first token is
			 * half a beat.
			 */
			// The melody file opens with the 11.5-beat instrumental introduction from
			// the same LilyPond, the first 21 notes, before the empty line.
			tempo: 103.5,
			key: 'G major',
			hash: '3f225bcd2e61',
			introType: 'fanfare',
		},
		// Nie Er wrote the music in Japan and posted it back to Shanghai weeks
		// before he drowned; it was the film song *Children of Troubled Times*
		// before it was an anthem. Provisional from 27 September 1949 and official
		// from 4 December 1982.
		composed: '1935-05-16',
		adopted: '1949-09-27',
	},
}
