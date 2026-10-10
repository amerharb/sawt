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
		instrument: {
			hash: '5144a7b61e22',
			intro: 0,
		},
		vocal: {
			hash: '525620a56a7d',
			intro: 0,
		},
		score: {
			// Eb major — the recording's key, confirmed by pitch-class analysis (A,
			// B, C#, E and F# are its five weakest). One verse from the
			// public-domain four-voice MIDI on Wikimedia Commons (track 1, already
			// monophonic), which is arranged in A: transposed down a tritone.
			tempo: 58,
			key: 'Eb major',
			hash: '02729daff2da',
		},
		composed: '1841',
		adopted: '1981',
	},
}
