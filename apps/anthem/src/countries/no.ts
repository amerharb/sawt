import { Country } from './Country'

export const no: Country = {
	code: 'no',
	name: {
		en: 'Norway',
		ar: 'النرويج',
		de: 'Norwegen',
		el: 'Νορβηγία',
		sv: 'Norge',
		th: 'นอร์เวย์',
		tr: 'Norveç',
		zh: '挪威',
	},
	flag: '🇳🇴',
	nativeLanguage: 'no',
	anthem: {
		nativeName: 'Ja, vi elsker dette landet',
		name: {
			en: 'Yes, We Love This Country',
		},
		// Bjørnson's first stanza. Custom sings the first and the last two, the
		// first by a long way the most often, and it is the one the choir
		// editions print above all the others
		lyrics: ['no'],
		/*
		 * No intro. The recording has a clear gap at 11 s, and it is the first of
		 * six — 11.0, 22.8, 29.3, 34.6, 41.9, 47.0 — spread right through the
		 * piece at five to twelve seconds apart. They are the seams between
		 * strains, not a fanfare in front of the tune, which is exactly the trap
		 * `silencedetect` sets and several countries here have fallen into. The
		 * score below confirms it: the band starts on the tune's first note.
		 */
		// Nordraak set it over the winter of 1863–64 and it was first sung in
		// public on 17 May 1864; Norway had no *official* anthem at all until the
		// Storting named this one, a hundred and fifty-five years later
		instrument: {
			hash: '2f4a24a9f967',
			intro: 0,
		},
		score: {
			/*
			 * E♭ major, 78 beats — the soprano of the four-part setting with
			 * Norwegian and English words on nationalanthems.info (CC BY 4.0,
			 * credited in README.md; see midi/README.md), 20 bars of 4/4 in C.
			 * The scan's staff lines are 3.5 px apart, so every note was checked
			 * against Nordraak's own 1864 manuscript for male choir on IMSLP
			 * (public domain), in E. They agree on every pitch but one, and the
			 * melody follows the printed sheet where they differ: it holds
			 * "frem" and "hjem" where the manuscript cuts them short, as the band
			 * does, and repeats D on the second "og den" where the manuscript
			 * steps down to C.
			 *
			 * **Transposed up a minor third**, C → E♭, to the band. Fitted against
			 * the recording in all twelve keys, E♭ scores 0.499 and no other key
			 * reaches 0.24; fitted four bars at a time, each section starts where
			 * the one before ends.
			 *
			 * Tempo 83, chosen by ear: the sheet prints only Maestoso, and the
			 * band takes the first eight bars at 83 and the rest at 75 to 79.
			 */
			tempo: 83,
			key: 'Eb major',
			hash: 'e6d188508cc5',
		},
		composed: '1864',
		adopted: '2019-12-11',
	},
}
