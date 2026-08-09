import { Country } from './Country'

export const dk: Country = {
	code: 'dk',
	name: {
		en: 'Denmark',
		ar: 'الدنمارك',
		de: 'Dänemark',
		el: 'Δανία',
		sv: 'Danmark',
		th: 'เดนมาร์ก',
		tr: 'Danimarka',
		zh: '丹麦',
	},
	flag: '🇩🇰',
	nativeLanguage: 'da',
	anthem: {
		nativeName: 'Der er et yndigt land',
		name: {
			en: 'There Is a Lovely Country',
		},
		// Oehlenschläger died 1850, so the words are public domain. The four
		// stanzas that are sung, not his original twelve — see tools/fetch-lyrics.py
		lyrics: ['da'],
		// no intro — the music starts at 0.1 s and the first phrase runs to 12.2 s
		score: {
			// F major, 102.5 beats. Transcribed from the Commons MIDI, which is the
			// first genuinely monophonic source in this project — one voice, 83 notes,
			// no chords to pick a top note out of. It is in D; moved up a minor third
			// to the recording's key. That key was measured from fundamentals rather
			// than a chroma histogram, which had misread Germany: 91% of them fall in
			// F major against 51% for D, and the piece closes on F twice.
			//
			// 77 of the 83 notes are diatonic. The chromatics are B♮ four times — the
			// raised fourth the move to the dominant needs — and C♯ twice.
			tempo: 79,
			melody:
				'F4/0.5 C5/1.5 C5/0.5 A4/1 F4/1 D5/2 r/1.5 F4/0.5 F5/1.5 F5/0.5 ' +
				'E5/1 D5/1 D5/1 C5/1 r/1 C5/1 E4/1.5 E4/0.5 F4/1 G4/1 A4/1 B4/1 ' +
				'C5/1 D5/1 C5/2 B4/2 C5/2 r/5.5 C5/0.5 E5/1.5 E5/0.5 D5/1 C5/1 ' +
				'C5/1.5 F5/0.5 F5/1 A4/1 D5/1.5 D5/0.5 D5/1 D5/1 D5/2 C#5/1 r/0.5 ' +
				'C5/0.5 C5/1 B4/1 Bb4/1 A4/1 D5/1 F5/1.5 F5/0.5 E5/1 D5/0.5 D5/1 ' +
				'C5/2 E4/1 F4/2 r/5.5 C5/0.5 E5/1.5 E5/0.5 D5/1 C5/1 C5/1.5 F5/0.5 ' +
				'F5/1 A4/1 D5/1.5 D5/0.5 D5/1 D5/1 D5/2 C#5/1 r/0.5 C5/0.5 C5/1 ' +
				'B4/1 Bb4/1 A4/1 D5/1 F5/1.5 F5/0.5 E5/1 D5/0.5 D5/1 C5/2 E4/1 ' +
				'F4/2',
		},
		composed: '1835',
		adopted: '1835',
	},
}
