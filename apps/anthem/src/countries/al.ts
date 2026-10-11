import { Country } from './Country'

export const al: Country = {
	code: 'al',
	name: {
		en: 'Albania',
		ar: 'ألبانيا',
		de: 'Albanien',
		el: 'Αλβανία',
		sv: 'Albanien',
		th: 'แอลเบเนีย',
		tr: 'Arnavutluk',
		zh: '阿尔巴尼亚',
	},
	flag: '🇦🇱',
	nativeLanguage: 'sq',
	anthem: {
		nativeName: 'Himni i Flamurit',
		name: {
			en: 'Hymn to the Flag',
		},
		// no intro: the band starts on the pickup and plays the verse, then the
		// chorus twice — the sheet's own form, with the chorus at 22.2 and 42.7 s
		instrument: {
			hash: '8e6b41ea3a7b',
			intro: 0,
		},
		score: {
			/*
			 * A♭ major, 96 beats — the melody sheet with Albanian lyrics on
			 * nationalanthems.info (CC BY 4.0, credited in README.md; see
			 * midi/README.md), three systems of 4/4 in G: the pickup, the
			 * verse's eight bars, and the chorus written out twice, through its
			 * first ending and then its second. The verse's second half ends on
			 * the dominant, "për shpëtim", as the sheet has it.
			 *
			 * **Transposed up a semitone**, G → A♭, to the band. Aligned by
			 * time-warping a rendering of the sheet against the recording in all
			 * twelve keys, A♭ costs 0.292 where no other key comes under 0.40, and
			 * the final chord is A♭–E♭.
			 *
			 * Tempo 90, chosen by ear: the sheet prints none, and the band takes
			 * the verse at 90, the first chorus at 94 and the second at 90, 91 on
			 * the whole.
			 */
			tempo: 90,
			key: 'Ab major',
			hash: '91531df8fe00',
		},
		composed: '1880',
		adopted: '1912-11-28',
	},
}
