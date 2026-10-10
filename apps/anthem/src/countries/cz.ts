import { Country } from './Country'

export const cz: Country = {
	code: 'cz',
	name: {
		en: 'Czech Republic',
		ar: 'التشيك',
		de: 'Tschechien',
		el: 'Τσεχία',
		sv: 'Tjeckien',
		th: 'เช็กเกีย',
		tr: 'Çekya',
		zh: '捷克',
	},
	flag: '🇨🇿',
	nativeLanguage: 'cs',
	anthem: {
		nativeName: 'Kde domov můj',
		name: {
			en: 'Where Is My Home?',
		},
		// Tyl died 1856, so the words are public domain. Only the first of the
		// song's two stanzas: § 7 of the act adopting the anthem says the anthem
		// *is* that stanza — see tools/fetch-lyrics.py
		lyrics: ['cs'],
		// no intro — the recording opens straight on the melody
		// both from the National Theatre's 2008 session under Bělohlávek: 🎤 is
		// Adam Plachetka's solo take, 👥 the chorus
		vocal: {
			hash: 'e91e3cc5eced',
			intro: 0,
		},
		choral: {
			hash: '05dbe917e36a',
			intro: 0,
		},
		instrument: {
			hash: '00c6186aea55',
			intro: 0,
		},
		score: {
			// E♭ major. From the public-domain MIDI on Wikimedia Commons, whose
			// melody track carries two interleaved voices — this is the top note at
			// each onset. That file is in E; transposed down a semitone to the
			// recording's key, which ends on E♭. 65.5 beats, the sixteen bars the
			// anthem is written in.
			tempo: 66,
			key: 'Eb major',
			hash: 'd6ba701fa488',
		},
		composed: '1834',
		adopted: '1993-01-01',
	},
}
