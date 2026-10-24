import { Country } from './Country'

export const ie: Country = {
	code: 'ie',
	name: {
		en: 'Ireland',
		ar: 'أيرلندا',
		de: 'Irland',
		el: 'Ιρλανδία',
		sv: 'Irland',
		th: 'ไอร์แลนด์',
		tr: 'İrlanda',
		zh: '爱尔兰',
	},
	flag: '🇮🇪',
	nativeLanguage: 'ga',
	anthem: {
		nativeName: 'Amhrán na bhFiann',
		name: {
			en: "The Soldier's Song",
			sv: 'Soldatens sång',
			de: 'Das Soldatenlied',
		},
		// The anthem is the chorus of the song, in Irish: Liam Ó Rinn's
		// translation (printed 1923; he died in 1943), as the Department of the
		// Taoiseach prints it, in the standard spelling — faoi, where Ó Rinn's
		// first text has the Munster fé. Kearney's English original (printed
		// 1912; he died in 1942) is the second, the words the Irish was made
		// from. Eleven lines each, the chorus alone.
		lyrics: ['ga', 'en'],
		// No intro: the tune starts at 0.16 s, the melody fitting from its first
		// beat. United States Navy Band, public domain; mixed down to mono and
		// the 2.7 s of silence at its end trimmed with a short fade.
		//
		// No 🎤 or 👥. Commons has two RTÉ recordings from about 1961 tagged
		// public domain, but both are copies taken from YouTube under tags that
		// do not fit them — an Irish government-works tag on a broadcaster's
		// recording, and a US renewal rule that does not apply to one.
		instrument: {
			hash: 'de54d08b8a6d',
			intro: 0,
		},
		score: {
			/*
			 * B♭ major, 92 beats: the chorus, 23 bars of 4/4 with no pickup. Read
			 * from the sheet on nationalanthems.info (CC BY 4.0, credited in
			 * README.md; see midi/README.md), checked note by note against an
			 * engraved "A Soldier's Song" on Commons, which sets it in G.
			 *
			 * **B♭ is measured from the recording**: the melody fits best a minor
			 * third above the engraving's G — 0.166 against 0.119 for the next key
			 * — and the held notes agree from their fundamentals, F under both
			 * D4s, A under the F♯, B♭ under the last note.
			 *
			 * The fermata on "rifles' peel" is not held: 🎼 has one tempo, and the
			 * band's two seconds of fermata and ritardando at the close are left to
			 * 🎺. Tempo 96, chosen by ear from 96, 102 and 108; the band's own pace
			 * is about 102, so 🎼 runs 57.5 s against the tape's 57.2.
			 */
			tempo: 96,
			key: 'Bb major',
			hash: '999c13d84572',
		},
		// Kearney wrote the words in 1909 and Heeney the music with him in 1910,
		// as the English Wikipedia's infobox has it (Wikisource's note says 1907);
		// first printed in 1912. The Irish Free State's Executive Council took
		// the chorus as the national anthem on 12 July 1926.
		composed: '1910',
		adopted: '1926-07-12',
	},
}
