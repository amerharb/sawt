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
		 * The recording is Keith Terrett's arrangement of 2023, rendered from
		 * Sibelius, as nationalanthems.info carries it at /ps.mp3. That site is
		 * CC BY 4.0 throughout and its FAQ says permission has been granted for
		 * every anthem file on it to be used by anyone, commercially or not —
		 * St Barthélemy's, marked ©, being the one exception. Not public domain,
		 * so the credit in README.md travels with it, beside the United
		 * Kingdom's 👥. It replaced a 90.9 s recording that sat at about −20 dB
		 * from end to end with half the dynamic range.
		 *
		 * As shipped: 49.5 s, mono — the two channels averaged, which costs the
		 * hard-panned instruments a few decibels and lands the file at
		 * −18.8 LUFS, where Brazil's and Syria's sit — with the 3.2 s of
		 * silence at the head and the 2.7 s tail cut, the last 0.3 s faded.
		 *
		 * No intro. The file dips every 1.72 s from first bar to last, ten to
		 * twenty decibels each time, which is the march's rest at the end of
		 * every bar rather than a seam; no gap is longer or deeper than the rest.
		 *
		 * No `score`: no notation in any of the thirty-six language editions and
		 * nothing on Commons. No `lyrics` either — Said Al Muzayin wrote them and
		 * died in 1984, so they are in term under any reading, and unlike Iran
		 * there is no statute to point at in place of a death year.
		 */
		// Ali Ismael set Al Muzayin's words in 1965; the PLO adopted it in 1972
		// and it became the state's under the 1996 basic law
		composed: '1965',
		adopted: '1996',
	},
}
