import { Country } from './Country'

export const ch: Country = {
	code: 'ch',
	name: {
		en: 'Switzerland',
		ar: 'سويسرا',
		de: 'Schweiz',
		el: 'Ελβετία',
		sv: 'Schweiz',
		th: 'สวิตเซอร์แลนด์',
		tr: 'İsviçre',
		zh: '瑞士',
	},
	flag: '🇨🇭',
	nativeLanguage: 'de',
	anthem: {
		nativeName: 'Schweizerpsalm',
		name: {
			en: 'Swiss Psalm',
		},
		// no intro: pitched music starts at full volume from the first moment. The
		// 0.5 s dip at 5.4 s is smaller than the later phrase breaks (23.7 / 35.0 /
		// 47.2 s), so it is a phrase boundary, not a structural one
		hasVocal: true,
		score: {
			// Eb major — the recording's key, confirmed by pitch-class analysis (A,
			// B, C#, E and F# are its five weakest). One verse from the
			// public-domain four-voice MIDI on Wikimedia Commons (track 1, already
			// monophonic), which is arranged in A: transposed down a tritone.
			tempo: 58,
			melody:
				'Bb3/0.75 Bb3/0.25 Bb3/1.0 Eb4/1.0 Eb4/0.75 D4/0.25 D4/1.5 ' +
				'r/0.5 Bb3/0.75 Bb3/0.25 Bb3/1.0 F4/1.0 F4/0.75 Eb4/0.25 ' +
				'Eb4/1.5 r/0.5 G4/1.5 G4/0.5 F4/0.5 F4/0.5 F4/1.5 Eb4/0.5 ' +
				'D4/1.0 C4/2.0 A3/1.0 Bb3/2.5 r/0.5 D4/0.75 D4/0.25 D4/1.0 ' +
				'D4/1.0 Eb4/1.5 D4/0.5 C4/0.5 Bb3/0.5 Bb3/2.75 r/0.25 Bb3/2.5 ' +
				'r/0.5 D4/0.75 D4/0.25 D4/1.0 D4/1.0 Eb4/1.5 F4/0.5 G4/1.0 ' +
				'F4/2.0 Eb4/1.0 D4/2.5 r/0.5 Bb3/0.75 Bb3/0.25 Bb3/1.0 Eb4/1.0 ' +
				'Db4/0.75 C4/0.25 C4/1.5 r/0.5 C4/0.75 C4/0.25 C4/1.0 F4/1.0 ' +
				'Eb4/0.75 D4/0.25 D4/1.5 r/0.5 G4/1.5 G4/0.5 Ab4/0.5 F4/0.5 ' +
				'Eb4/2.0 D4/1.0 Eb4/2.5 r/0.5 G4/1.5 G4/0.5 Ab4/0.5 F4/0.5 ' +
				'Eb4/2.0 Eb4/1.0 Eb4/1.0 D4/0.5 C4/0.5 D4/1.0 Eb4/3.0',
		},
		composed: '1841',
		adopted: '1981',
	},
}
