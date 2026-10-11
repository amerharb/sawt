import { Country } from './Country'

export const lr: Country = {
	code: 'lr',
	name: {
		en: 'Liberia',
		ar: 'ليبيريا',
		de: 'Liberia',
		el: 'Λιβερία',
		sv: 'Liberia',
		th: 'ไลบีเรีย',
		tr: 'Liberya',
		zh: '利比里亚',
	},
	flag: '🇱🇷',
	nativeLanguage: 'en',
	anthem: {
		nativeName: 'All Hail, Liberia, Hail!',
		name: {
			en: 'All Hail, Liberia, Hail!',
		},
		// Both stanzas, fourteen lines each. Warner died in 1880 and Luca in 1869,
		// which with Peru's 1831 and 1878 makes these the two oldest anthems in the
		// app by the death of their authors. Warner wrote the words before becoming
		// Liberia's third president.
		lyrics: ['en'],
		instrument: {
			hash: '5b91c0a14296',
			intro: 0,
		},
		score: {
			/*
			 * B♭ major, 130 beats. From the World Atlas MIDI, and **the tune moves
			 * between two tracks as the Vatican's does**: `trumpet(s)` carries it,
			 * but twice drops to a pedal — 18.6 beats from q45 and 15.2 from q69 —
			 * while `fr. horn(s)` takes over. The score is the trumpet with the
			 * horn filling those two passages, which fits the recording better than
			 * the trumpet alone (r = 0.55 against 0.54) and avoids two nineteen-beat
			 * drones. The second of the two is an interlude with no tune at all,
			 * running accompaniment under a held note, and the score follows it
			 * honestly rather than inventing one.
			 *
			 * Nothing transposed — the MIDI is already in the recording's key, and
			 * that is the best-measured key here yet: **five of the seven notes held
			 * two beats or more come back at exactly 0 semitones** from their
			 * fundamentals, the two misses being an octave and a fifth.
			 *
			 * Tempo 99.5 is a sharp peak, the correlation falling to 0.40 by 98 and
			 * 0.41 by 101. The alignment was checked in quarters rather than only
			 * overall: every section lands within 0.09 s of where the global fit
			 * puts it, so nothing is missing or repeated. Onsets are snapped to a
			 * sixteenth grid, which is why the score parses to 130.0 beats against
			 * the MIDI's 129.97 — the drift a note-by-note rounding leaves behind is
			 * gone. 78.4 s against the recording's 82.1; the rest is the band's
			 * closing cadence.
			 */
			tempo: 99.5,
			key: 'Bb major',
			hash: 'fddbff0c6ed3',
		},
		// Liberia declared independence in 1847 and took this as its anthem the same
		// year — older than most of the European anthems in the app.
		composed: '1847',
		adopted: '1847',
	},
}
