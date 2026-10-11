import { Country } from './Country'

export const se: Country = {
	code: 'se',
	name: {
		en: 'Sweden',
		ar: 'السويد',
		de: 'Schweden',
		el: 'Σουηδία',
		sv: 'Sverige',
		th: 'สวีเดน',
		tr: 'İsveç',
		zh: '瑞典',
	},
	flag: '🇸🇪',
	nativeLanguage: 'sv',
	anthem: {
		nativeName: 'Du gamla, du fria',
		name: {
			en: 'Thou ancient, thou free',
			ar: 'أيتها القديمة، أيتها الحرة',
		},
		instrument: {
			hash: '47ec0d031433',
			intro: 7.42,
			introType: 'fanfare',
		},
		score: {
			/*
			 * B♭ major, 39.5 beats — the melody staff of "Sång till Norden" on
			 * nationalanthems.info (CC BY 4.0, credited in README.md; see
			 * midi/README.md), a pickup and ten bars of 4/4. It replaced the
			 * World Atlas trumpet line, which had the same notes but held on where
			 * the sheet breathes — an eighth rest before "Vi" and before each
			 * "Din" — and held the last note two beats where the sheet has one.
			 *
			 * No intro: the sheet opens on the sung "Du", so the melody file
			 * has no intro part, as before; the band's own opening is the 🥁 cut
			 * above. Tempo 65, unchanged.
			 */
			tempo: 65,
			key: 'Bb major',
			hash: 'bd7ea9650f59',
		},
		composed: '1844',
		// never formally adopted — Sweden's anthem is de facto, by tradition
	},
}
