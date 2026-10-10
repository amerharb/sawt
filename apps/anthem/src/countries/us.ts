import { Country } from './Country'

export const us: Country = {
	code: 'us',
	name: {
		en: 'United States of America',
		ar: 'الولايات المتحدة الأمريكية',
		de: 'Vereinigte Staaten von Amerika',
		el: 'Ηνωμένες Πολιτείες Αμερικής',
		sv: 'USA',
		th: 'สหรัฐอเมริกา',
		tr: 'Amerika Birleşik Devletleri',
		zh: '美国',
	},
	flag: '🇺🇸',
	nativeLanguage: 'en',
	anthem: {
		nativeName: 'The Star-Spangled Banner',
		name: {
			en: 'The Star-Spangled Banner',
			ar: 'الراية المرصعة بالنجوم',
		},
		instrument: {
			hash: 'cc2c4cb07bc1',
			intro: 0,
		},
		// solo vocalist with band, U.S. Navy Band (public domain, a work of the
		// U.S. government) — the same ensemble family as the instrumental
		vocal: {
			hash: '47a79a430fb2',
			intro: 0,
		},
		score: {
			// Bb major, 3/4, quarter = 100; melody is the top voice of the
			// public-domain piano MIDI on Wikimedia Commons
			tempo: 100,
			key: 'Bb major',
			hash: '4eb33a14b278',
		},
		// the tune (To Anacreon in Heaven) is older, c. 1773; 1814 is when Francis
		// Scott Key's words were set to it and the song as we know it appeared
		composed: '1814',
		adopted: '1931-03-03',
	},
}
