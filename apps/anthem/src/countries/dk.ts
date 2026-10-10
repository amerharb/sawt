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
		instrument: {
			hash: 'dd206e5f4bd9',
			intro: 0,
		},
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
			key: 'F major',
			hash: 'd195bc1f1aa6',
		},
		composed: '1835',
		adopted: '1835',
	},
}
