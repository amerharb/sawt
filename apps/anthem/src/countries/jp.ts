import { Country } from './Country'

export const jp: Country = {
	code: 'jp',
	name: {
		en: 'Japan',
		ar: 'اليابان',
		de: 'Japan',
		el: 'Ιαπωνία',
		sv: 'Japan',
		th: 'ญี่ปุ่น',
		tr: 'Japonya',
		zh: '日本',
	},
	flag: '🇯🇵',
	nativeLanguage: 'ja',
	anthem: {
		nativeName: '君が代',
		name: {
			en: "His Majesty's Reign",
		},
		// The oldest words of any anthem, and the only ones here whose public
		// domain needs no argument at all: a waka by an unnamed poet, collected
		// in the Kokin Wakashū around 920. Five lines, which is the whole poem.
		lyrics: ['ja'],
		/*
		 * No intro. The band's dips fall at 9.5, 29.9 and 40.8 s — spread through
		 * the piece, which makes them the breaths between its phrases rather than
		 * a fanfare in front of it. The recording is at strength by 0.1 s.
		 */
		score: {
			// D dorian, 11 bars of 4/4, 44 beats — the whole anthem, which is as
			// short as they come. From the LilyPond block on ja.wikipedia, whose
			// own marking is 60 and is what is kept. The US Navy Ceremonial Band
			// takes 57.4 s over the same 44 beats, which is 46, so 🎼 runs thirteen
			// seconds shorter than 🎺 — Kimigayo is slow enough that both are
			// defensible, and this is the written one, as Poland's is.
			tempo: 60,
			melody:
				'D4/1 C4/1 D4/1 E4/1 G4/1 E4/1 D4/2 E4/1 G4/1 A4/1 G4/0.5 ' +
				'A4/0.5 D5/1 B4/1 A4/1 G4/1 E4/1 G4/1 A4/2 D5/1 C5/1 D5/2 ' +
				'E4/1 G4/1 A4/1 G4/1 E4/1.5 G4/0.5 D4/2 A4/1 C5/1 D5/2 C5/1 ' +
				'D5/1 A4/1 G4/1 A4/1 G4/0.5 E4/0.5 D4/2',
		},
		// Hayashi Hiromori and Oku Yoshiisa set the poem in 1880 and Franz Eckert
		// harmonised it; all three were dead before 1917. It had been the de facto
		// anthem since 1888 and was made the official one by the flag-and-anthem
		// act of 1999
		composed: '1880',
		adopted: '1999-08-13',
	},
}
