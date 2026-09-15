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
		intro: 8.6,
		/*
		 * No `score`, and this is the first country where that was a finding
		 * rather than an omission. None of the seventy-one Wikipedia editions
		 * carries one. Commons has the 1957 official sheet — handwritten, scanned
		 * 450 pixels wide — and Keil's 1890 first edition from the Biblioteca
		 * Nacional, also handwritten; neither is legible enough to transcribe
		 * without inventing notes, and a pitch track of the band returns harmony
		 * rather than a melody line. Albania, Iraq and Italy are live on the same
		 * terms: 🎼 simply does not offer a country it has no notes for.
		 */
		// Keil wrote the march in 1890, after the British Ultimatum; it replaced
		// the royal hymn when the republic came
		composed: '1890',
		adopted: '1911-07-19',
	},
}
