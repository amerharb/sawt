import { Country } from './Country'

// Not a country: a US territory with its own ISO code and flag, and its own
// anthem beside the United States'. The first entry here that is not a state.
export const pr: Country = {
	code: 'pr',
	name: {
		en: 'Puerto Rico',
		ar: 'بورتوريكو',
		de: 'Puerto Rico',
		el: 'Πουέρτο Ρίκο',
		sv: 'Puerto Rico',
		th: 'ปวยร์โตรีโก',
		tr: 'Porto Riko',
		zh: '波多黎各',
	},
	flag: '🇵🇷',
	nativeLanguage: 'es',
	anthem: {
		nativeName: 'La Borinqueña',
		name: {
			en: 'The Borinquen',
		},
		// Manuel Fernández Juncos's words (printed 1901; he died in 1928) in the
		// wording of Ley Núm. 2 of 1952, article 2, which prints them as one
		// paragraph: set out in lines by hand, its last phrase written out five
		// times as the law has it. The English Wikipedia's lines differ in two
		// words (Borinquén, arrullos plácidos); see fetch-lyrics.py.
		lyrics: ['es'],
		/*
		 * The United States Navy Band playing Astol's original danza, from the
		 * 1860s — chosen by ear over its recording of the march adopted today
		 * (Luis Miranda's 1922 version, slower, in G minor), which the law has
		 * at government ceremonies. Public domain; mixed down to mono, the
		 * near-silence at its end trimmed with a short fade. F minor, a steady
		 * 94, and 19 s of closing music after the tune.
		 *
		 * The intro is the danza's own opening, ending on an F minor chord; the
		 * cut at 24.4 s sits in the breath after it, so the tune opens on the
		 * band's lead-in chord, 0.5 s before its first note. Chosen by ear over
		 * a cut on that first note.
		 */
		instrument: {
			hash: '82bb7839a702',
			intro: 24.4,
			introType: 'prelude',
		},
		score: {
			/*
			 * F minor, 87 beats: 22 bars of 4/4, the last of three, no pickup.
			 * The top line of the piano sheet on nationalanthems.info (CC BY 4.0,
			 * credited in README.md; see midi/README.md), which is in G minor at
			 * ♩=88, read at eight times its size — its staff lines are 4 px apart.
			 *
			 * **F minor is measured from the recording**: a whole tone below the
			 * sheet fits at 0.162 against 0.116 for any other key, the tune from
			 * 24.9 s, and the reading follows it within half a second almost
			 * throughout. The Navy's recording of the adopted march plays the same
			 * 22 bars in G minor, slowing at phrase ends.
			 *
			 * Tempo 88, the sheet's, chosen by ear from 69, 76 and 88.
			 */
			tempo: 88,
			key: 'F minor',
			hash: '9a4ebc9e3cb3',
		},
		// Astol wrote the danza in 1867. Ley Núm. 2 of 24 July 1952 made the music
		// the anthem; the words followed in 1977 (Ley 123).
		composed: '1867',
		adopted: '1952-07-24',
	},
}
