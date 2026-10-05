import { Country } from './Country'

export const br: Country = {
	code: 'br',
	name: {
		en: 'Brazil',
		ar: 'البرازيل',
		de: 'Brasilien',
		el: 'Βραζιλία',
		sv: 'Brasilien',
		th: 'บราซิล',
		tr: 'Brezilya',
		zh: '巴西',
	},
	flag: '🇧🇷',
	nativeLanguage: 'pt',
	anthem: {
		nativeName: 'Hino Nacional Brasileiro',
		name: {
			en: 'Brazilian National Anthem',
		},
		// Both parts, fourteen stanzas, as the Portuguese Wikisource prints them.
		// Duque-Estrada died in 1927, and the state bought his rights outright in
		// 1922, the year it adopted the words; da Silva died in 1865.
		lyrics: ['pt'],
		/*
		 * The introduction is the first quatrain's own melody played with trills
		 * — the famous one — so the tape's first half-minute matches the stanza's
		 * first sixteen bars chunk for chunk. Its last chord strikes at 28.1 s and
		 * has died by 28.6; the band then goes on quietly from the second
		 * quatrain, "Se o penhor dessa igualdade", soft beats from 29.2 s and the
		 * downbeat the chroma match puts at 31.2. The cut is 29.0, chosen by ear:
		 * the measurement had offered 31.0–31.4, the ear heard the turn two
		 * seconds earlier, and 29.0 falls in the silence between the chord's decay
		 * and the first soft beat.
		 *
		 * Brazil's own recordings on Commons — Orquestra Philharmonia, the Army
		 * choir, the Ministry of Education's — are tagged as government works, but
		 * the tag's own text gives such works seventy years from disclosure, so
		 * they are not public domain; the Navy tape is the one clean recording.
		 * No 🎤 or 👥 for the same reason: the one clearly free sung recording is
		 * Vicente Celestino's acoustic 78 of 1917, too poor.
		 */
		intro: 29,
		score: {
			/*
			 * B♭ major, 223.5 beats, 4/4 — the stanza once, from "Ouviram do
			 * Ipiranga" to the coda, which the band never plays plain: it has the
			 * first quatrain only ornamented, as the introduction, so 🎼 is the one
			 * rendering where the tune begins at the beginning. From the flutetunes
			 * flute line (see midi/README.md), the second pass of its written-out
			 * repeat, checked against its own engraving.
			 *
			 * **No transposition**: Law 5.700 puts the instrumental anthem in B♭ and
			 * the band is there — chroma correlation 0.25 at no shift, nothing above
			 * 0.11 at any other.
			 *
			 * Tempo 120, the engraving's ♩ = 120, chosen by ear from 120, 122 and
			 * 124; the band's own pace measures 122 over both halves of the tune
			 * (64 beats in 31.4 s and 31.5 s), so 🎼 runs 111.8 s against the tape's
			 * 111.9.
			 */
			tempo: 120,
			melody:
				'F4/0.5 F4/0.5 E4/0.25 F4/0.25 A#4/0.75 A#4/0.25 A#4/0.5 A4/0.25 ' +
				'A#4/0.25 D5/0.75 D5/0.25 D5/0.5 C#5/0.25 D5/0.25 F5/1 A#5/1 r/1 ' +
				'F4/0.75 F4/0.25 A#4/0.75 A4/0.25 C5/0.75 A#4/0.25 D5/0.75 C5/0.25 ' +
				'D#5/0.75 D5/0.25 B4/1 C5/1 r/0.5 G4/0.5 G4/0.5 F#4/0.25 G4/0.25 ' +
				'C5/0.75 C5/0.25 C5/0.5 B4/0.25 C5/0.25 D#5/0.75 D#5/0.25 D#5/0.5 ' +
				'D5/0.25 D#5/0.25 G5/1 C6/1 r/1 C6/0.75 A#5/0.25 A#5/0.75 A5/0.25 ' +
				'A5/0.75 G5/0.25 G5/0.75 F5/0.25 F5/0.75 D#5/0.25 C#5/1 D5/1 r/0.5 ' +
				'F4/0.5 F4/0.5 E4/0.25 F4/0.25 A#4/0.75 A#4/0.25 A#4/0.5 A4/0.25 ' +
				'A#4/0.25 D5/0.75 A#4/0.25 A#4/0.5 A4/0.25 A#4/0.25 G4/0.75 C5/0.25 ' +
				'C5/0.5 B4/0.25 C5/0.25 D#5/0.75 C5/0.25 C5/0.5 B4/0.25 C5/0.25 ' +
				'A4/0.75 D5/0.25 D5/0.5 C#5/0.25 D5/0.25 F5/0.75 D5/0.25 D5/0.5 ' +
				'C#5/0.25 D5/0.25 A#4/0.75 D#5/0.25 D#5/0.5 D5/0.25 D#5/0.25 C5/0.75 ' +
				'F5/0.25 F5/0.5 E5/0.25 F5/0.25 D5/1 A#5/1 r/1 A5/0.75 G5/0.25 F5/1 ' +
				'r/1 A4/1 r/1 A#4/1 r/2 F4/1 A#4/0.75 A4/0.25 A#4/0.75 C5/0.25 ' +
				'D5/0.75 C5/0.25 D5/0.75 D#5/0.25 E5/1.5 F5/0.25 D5/0.25 A#4/1 ' +
				'F4/0.75 F4/0.25 A#4/0.75 A4/0.25 C5/0.75 A#4/0.25 D5/0.75 C5/0.25 ' +
				'D#5/0.75 D5/0.25 B4/1 C5/1 r/1 F4/1 C5/0.75 B4/0.25 C5/0.75 D5/0.25 ' +
				'D#5/0.75 D5/0.25 D#5/0.75 F5/0.25 F#5/1.5 G5/0.25 D#5/0.25 C5/1 ' +
				'F4/0.75 F4/0.25 C5/0.75 B4/0.25 D5/0.75 C5/0.25 D#5/0.75 D5/0.25 ' +
				'F5/0.75 D#5/0.25 C#5/1 D5/1 r/1 D5/0.75 D5/0.25 D#5/1 D5/1 r/0.75 ' +
				'D5/0.25 D#5/0.75 D5/0.25 D5/1 G5/1 r/1 F5/0.5 D#5/0.5 D#5/0.5 ' +
				'D5/0.5 D5/0.5 C5/0.5 C5/0.5 A#4/0.5 A#4/0.5 A4/0.5 A4/1 G4/1 r/1 ' +
				'C5/0.75 C5/0.25 D5/1 C5/1 r/0.75 C5/0.25 D5/0.75 C5/0.25 C5/1 F5/1 ' +
				'r/1 E5/0.5 D5/0.5 D5/0.5 C5/0.5 C5/0.5 A#4/0.5 A#4/0.5 A4/0.5 ' +
				'A4/0.5 G4/0.5 F4/1 F5/1 r/0.5 F4/0.5 A4/0.5 C5/0.5 C5/0.5 F4/0.25 ' +
				'G4/0.25 A4/0.25 A#4/0.25 C5/0.25 D5/0.25 D#5/0.5 F5/0.25 G5/0.25 ' +
				'A5/0.25 A#5/0.25 C6/0.25 D6/0.25 D#6/0.5 C6/0.5 A5/0.5 F5/0.5 ' +
				'D#5/0.5 C5/0.5 A4/0.5 F4/0.5 A#4/0.75 A4/0.25 A#4/0.75 C5/0.25 ' +
				'D5/0.75 C5/0.25 D5/0.75 D#5/0.25 E5/1.5 F5/0.25 D5/0.25 A#4/1 ' +
				'F4/0.75 F4/0.25 A#4/0.75 A4/0.25 C5/0.75 A#4/0.25 D5/0.75 C5/0.25 ' +
				'D#5/0.75 D5/0.25 B4/1 C5/1 r/1 F4/1 C5/0.75 B4/0.25 C5/0.75 D5/0.25 ' +
				'D#5/0.75 D5/0.25 D#5/0.75 F5/0.25 F#5/1.5 G5/0.25 D#5/0.25 C5/1 ' +
				'F4/0.75 F4/0.25 C5/0.75 B4/0.25 D5/0.75 C5/0.25 D#5/0.75 D5/0.25 ' +
				'F5/0.75 D#5/0.25 C#5/1 D5/1 r/1.5 A#4/0.5 C5/0.75 A#4/0.25 A4/0.75 ' +
				'A#4/0.25 A4/0.75 A#4/0.25 C5/0.75 A#4/0.25 A#4/1.5 C5/0.25 D5/0.25 ' +
				'D#5/1.5 C5/0.5 D5/0.75 C5/0.25 B4/0.75 C5/0.25 B4/0.75 C5/0.25 ' +
				'D5/0.75 C5/0.25 C5/1.5 D5/0.25 E5/0.25 F5/1.5 D5/0.5 D#5/0.75 ' +
				'D5/0.25 C#5/0.75 D5/0.25 C#5/0.75 D5/0.25 D#5/0.75 D5/0.25 D5/1 ' +
				'G5/1 r/0.5 F5/0.5 D#5/0.5 C5/0.5 C5/1 A#4/1 r/0.5 A4/0.5 A#4/0.5 ' +
				'C5/0.5 D#5/0.5 D5/0.5 A4/0.5 A#4/0.5 F#4/0.5 G4/0.5 D#5/0.5 C5/0.5 ' +
				'C5/1 A#4/1 r/0.5 C5/0.5 D5/0.5 D#5/0.5 E5/0.5 F5/0.5 D5/0.5 A#4/0.5 ' +
				'G4/0.375 A4/0.25 A#4/0.375 C5/0.375 D5/0.25 D#5/0.375 D5/0.5 ' +
				'D#5/0.25 D5/0.25 C5/0.25 A#4/0.25 A4/0.25 G4/0.25 F4/0.375 A4/0.25 ' +
				'G4/0.375 F4/0.375 G4/0.25 A4/0.375 A#4/1 A#4/0.375 A4/0.25 ' +
				'A#4/0.375 D5/0.375 C#5/0.25 D5/0.375 F5/0.375 E5/0.25 F5/0.375 ' +
				'A#5/1 A#4/0.375 A4/0.25 A#4/0.375 D5/0.375 C#5/0.25 D5/0.375 ' +
				'F5/0.375 E5/0.25 F5/0.375 A#5/1 r/1 D6/1 r/0.75 A#4/0.25 A#4/2',
		},
		// da Silva's music was first played on 13 April 1831, the week Pedro I
		// abdicated, and decreed the Republic's anthem on 20 January 1890; the
		// anthem took its complete form with Duque-Estrada's words on 6 September
		// 1922, the eve of the centenary of independence.
		composed: '1831',
		adopted: '1922-09-06',
	},
}
