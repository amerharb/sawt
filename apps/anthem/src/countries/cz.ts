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
		hasVocal: true,
		hasChoral: true,
		score: {
			// E♭ major. From the public-domain MIDI on Wikimedia Commons, whose
			// melody track carries two interleaved voices — this is the top note at
			// each onset. That file is in E; transposed down a semitone to the
			// recording's key, which ends on E♭. 65.5 beats, the sixteen bars the
			// anthem is written in.
			tempo: 66,
			melody:
				'Bb4/2 C5/0.5 Bb4/0.5 F4/1 Ab4/2 G4/0.5 F4/0.5 Eb4/3 Eb4/0.5 ' +
				'Eb4/0.5 Eb4/1 Ab4/0.5 Ab4/2 Bb4/0.5 C5/0.5 Bb4/0.5 G4/0.5 Eb4/2 ' +
				'Eb4/0.5 Eb4/0.5 Eb4/0.5 Ab4/0.5 Ab4/0.5 C5/0.5 Eb5/1 D5/0.5 ' +
				'C5/0.5 C5/1 Bb4/2 Bb4/0.5 Bb4/0.5 Bb4/2.5 C5/0.5 Bb4/0.5 Ab4/0.5 ' +
				'G4/3 Bb4/0.5 Bb4/0.5 D5/2.5 C5/0.5 Bb4/0.5 Ab4/0.5 G4/3 G4/0.5 ' +
				'G4/0.5 G4/1.5 G4/0.5 G4/1 A4/0.5 B4/0.5 B4/0.5 C5/0.5 C5/2 C5/0.5 ' +
				'C5/0.5 C5/0.5 Bb4/0.5 Bb4/2 Ab4/0.5 Bb4/0.5 G4/1 Eb5/2 D5/0.5 ' +
				'C5/0.5 C5/1 Bb4/2 F4/0.5 G4/0.5 Eb4/2',
		},
		composed: '1834',
		adopted: '1993-01-01',
	},
}
