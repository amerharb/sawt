import { Country } from './Country'

export const pt: Country = {
	code: 'pt',
	name: {
		en: 'Portugal',
		ar: 'البرتغال',
		de: 'Portugal',
		el: 'Πορτογαλία',
		sv: 'Portugal',
		th: 'โปรตุเกส',
		tr: 'Portekiz',
		zh: '葡萄牙',
	},
	flag: '🇵🇹',
	nativeLanguage: 'pt',
	anthem: {
		nativeName: 'A Portuguesa',
		name: {
			en: 'The Portuguese',
		},
		// the first stanza and the chorus, as protocol sings it — the poem has
		// three stanzas, each followed by the same chorus
		lyrics: ['pt'],
		// Keil's march opens instrumentally and the voice waits four bars, which
		// is why the 1957 official sheet numbers its first entry at bar 4. The
		// band does not stop cleanly: it falls away here, comes back for an
		// instant near 8.7 s, falls again, and only settles around 9.4 s. 8.6 is
		// a tenth into that fall, chosen by ear from five candidates across the
		// second either side of it
		instrument: {
			hash: '7f9feeb0d5f2',
			intro: 8.6,
			introType: 'fanfare',
		},
		score: {
			/*
			 * E♭ major, 104.25 beats — the melody staff of the engraved sheet with
			 * Portuguese words on nationalanthems.info (CC BY 4.0, credited in
			 * README.md; see midi/README.md), 4/4, ♩ = 120. It replaced nothing:
			 * the 1957 official sheet and Keil's first edition on Commons are both
			 * handwritten and too small to read.
			 *
			 * No transposition: the band plays it in E♭. Fitted in all twelve
			 * keys, E♭ scores 0.553 and no other key reaches 0.22, and the tune
			 * enters at 8.6 s, where the 🥁 cut above already was.
			 *
			 * One change from the sheet: G♭, not G, on "Dos teus egrégios avós"
			 * and on the first note of "Que há-de guiar-te" (bars 17 and 19). The
			 * band plays G♭ there over E♭ minor, the sheet's own accompaniment has
			 * G♭ in both bars, and scored against the band G♭ wins bar 17 by 0.60
			 * to 0.44, where the same test bears out the sheet's D♭ and C♭ in bar
			 * 15 and its G naturals in bars 13 and 14.
			 *
			 * Tempo 120, as printed. The band is slower, 104 to 109, and 🎼 is not
			 * held to its pace.
			 */
			// The melody file opens with the sheet's first four bars, the
			// instrumental opening, before the empty line; they fit the band's
			// first 8.4 s at 109.
			tempo: 120,
			key: 'Eb major',
			hash: '461214b9c47b',
			introType: 'fanfare',
		},
		// Keil wrote the march in 1890, after the British Ultimatum; it replaced
		// the royal hymn when the republic came
		composed: '1890',
		adopted: '1911-07-19',
	},
}
