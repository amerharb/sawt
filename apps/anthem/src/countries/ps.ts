import { Country } from './Country'

export const ps: Country = {
	code: 'ps',
	name: {
		en: 'Palestine',
		ar: 'فلسطين',
		de: 'Palästina',
		el: 'Παλαιστίνη',
		sv: 'Palestina',
		th: 'ปาเลสไตน์',
		tr: 'Filistin',
		zh: '巴勒斯坦',
	},
	flag: '🇵🇸',
	nativeLanguage: 'ar',
	anthem: {
		nativeName: 'فدائي',
		name: {
			en: 'Warrior',
		},
		/*
		 * No intro. The recording sits at about −20 dB from end to end, and what
		 * dips it has are six shallow ones a beat or so apart between 1.5 and
		 * 4.9 s — a rhythm, not a seam. The only one that lasts is at 10.6 s and
		 * lasts a quarter of a second.
		 *
		 * No `score`: no notation in any of the thirty-six language editions and
		 * nothing on Commons. No `lyrics` either — Said Al Muzayin wrote them and
		 * died in 1984, so they are in term under any reading, and unlike Iran
		 * there is no statute to point at in place of a death year.
		 *
		 * The recording stays as it is. Commons has the same performance in a
		 * better master — fifty decibels of range against thirty-five — but it is
		 * CC BY from a YouTube import, where every other recording here is public
		 * domain under a named law. Better audio, thinner provenance.
		 */
		// Ali Ismael set Al Muzayin's words in 1965; the PLO adopted it in 1972
		// and it became the state's under the 1996 basic law
		composed: '1965',
		adopted: '1996',
	},
}
