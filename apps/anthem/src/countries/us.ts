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
		// solo vocalist with band, U.S. Navy Band (public domain, a work of the
		// U.S. government) — the same ensemble family as the instrumental
		hasVocal: true,
		score: {
			// Bb major, 3/4, quarter = 100; melody is the top voice of the
			// public-domain piano MIDI on Wikimedia Commons
			tempo: 100,
			melody:
				'F4/0.5 D4/0.5 Bb3/1 D4/1 F4/1 Bb4/2 D5/0.5 C5/0.5 ' +
				'Bb4/1 D4/1 E4/1 F4/2 F4/0.5 F4/0.5 D5/1 C5/1 ' +
				'Bb4/1 A4/2 G4/0.5 A4/0.5 Bb4/1 Bb4/1 F4/1 D4/1 ' +
				'Bb3/1 F4/0.5 D4/0.5 Bb3/1 D4/1 F4/1 Bb4/2 D5/0.5 ' +
				'C5/0.5 Bb4/1 D4/1 E4/1 F4/2 F4/0.5 F4/0.5 D5/1 ' +
				'C5/1 Bb4/1 A4/2 G4/0.5 A4/0.5 Bb4/1 Bb4/1 F4/1 ' +
				'D4/1 Bb3/1 D5/0.5 D5/0.5 D5/1 Eb5/1 F5/1 F5/2 ' +
				'Eb5/0.5 D5/0.5 C5/1 D5/1 Eb5/1 Eb5/2 Eb5/1 D5/1 ' +
				'C5/1 Bb4/1 A4/2 G4/0.5 A4/0.5 Bb4/1 D4/1 E4/1 ' +
				'F4/2 F4/1 Bb4/1 Bb4/1 Bb4/0.5 A4/0.5 G4/1 G4/1 ' +
				'G4/1 C5/1 Eb5/0.5 D5/0.5 C5/0.5 Bb4/0.5 Bb4/1 A4/1 ' +
				'F4/0.5 F4/0.5 Bb4/1.5 C5/0.5 D5/0.5 Eb5/0.5 F5/2 Bb4/0.5 ' +
				'C5/0.5 D5/1.5 Eb5/0.5 C5/1 Bb4/2',
		},
		// the tune (To Anacreon in Heaven) is older, c. 1773; 1814 is when Francis
		// Scott Key's words were set to it and the song as we know it appeared
		composed: '1814',
		adopted: '1931-03-03',
	},
}
