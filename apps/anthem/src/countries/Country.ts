// the interface languages; they also key each country's display name (shown on a
// card when the display mode is "name"), so every country needs all of them.
export type Language = 'en' | 'ar' | 'de' | 'el' | 'sv' | 'th' | 'tr' | 'zh'

// The language the anthem itself is sung in (ISO 639-1, plus 'la' for Latin).
// Separate from the interface languages above — most anthems are in neither of
// them. Add a code here as countries are added. Where a country has several
// official languages (Belgium, Switzerland, Luxembourg) this is the one the
// recording is sung in.
export type NativeLanguage =
	| 'ar' | 'bn' | 'ca' | 'cs' | 'da' | 'de' | 'el' | 'en' | 'es' | 'fa'
	| 'fi' | 'fr' | 'hu' | 'id' | 'it' | 'ja' | 'la' | 'lb' | 'mi' | 'nl' | 'no'
	| 'pl' | 'pt' | 'sq' | 'sv' | 'th' | 'tr' | 'uk' | 'ur' | 'zh'

/*
 * What comes before the tune in a recording. `none` is the default and is not
 * written out; the others say what the 🥁 window holds.
 *   drum     a roll on the drums, unpitched — Belgium's, Pakistan's, the UK's
 *   fanfare  a short instrumental call or opening bars, under ten seconds
 *   prelude  a long orchestral introduction, part of the composition itself —
 *            Italy's eleven bars, Argentina's minute
 */
export type IntroType = 'none' | 'drum' | 'fanfare' | 'prelude'

/*
 * One recording of the anthem, at `public/sound/<kind>/<code>.aac` where the
 * kind is the key it sits under: `instrument`, `vocal` or `choral`. Present
 * means the file exists; there is no separate flag.
 */
export type Recording = {
	/*
	 * The first twelve hex digits of the file's SHA-256, written by
	 * `tools/hash-sounds.py`. It travels on the url as `?v=`, so a replaced
	 * file is a new url and every cache — the browser's and the app's own
	 * IndexedDB — fetches it fresh, with no `cacheVersion` to raise. Rerun
	 * the tool after changing a file; its `--check` fails while one is stale.
	 */
	hash: string,
	// where the intro ends, in seconds into this file: 🥁 plays 0 → intro and
	// the tune proper plays intro → end. 0 means the recording has none
	intro: number,
	introType?: IntroType,
}

// a key as a musician writes it, in ASCII: 'Eb major', 'F# minor' — or a mode,
// for a tune that is neither: Japan's is 'D dorian'
type Tonic = 'C' | 'C#' | 'Db' | 'D' | 'D#' | 'Eb' | 'E' | 'F' | 'F#' | 'Gb' | 'G' | 'G#' | 'Ab' | 'A' | 'A#' | 'Bb' | 'B'
export type Key = `${Tonic} ${'major' | 'minor' | 'dorian'}`

/*
 * The melody as notes, synthesized live in the browser instead of streaming a
 * recording. The notes themselves live outside the bundle, at
 * `public/melody/<code>.txt` (see src/synth.ts for the format), fetched and
 * cached like a recording and versioned the same way. An empty line in that
 * file ends its intro, so where a recording says `intro` in seconds a melody
 * says it in the file itself; 🎼 plays the part after it.
 */
export type Score = {
	// quarter notes per minute
	tempo: number,
	// the key the notes are written in, which is the recording's
	key: Key,
	// of public/melody/<code>.txt, as for a recording
	hash: string,
	// what the melody's intro is, when its file has one
	introType?: IntroType,
}

export type Country = {
    code: string,
    name: Record<Language, string>,
    flag: string,
		nativeLanguage: NativeLanguage,
    anthem: {
			nativeName: string,
			// the anthem's title translated. Not shown in the UI yet, so it is
			// partial — fill a language in when there is a reliable translation.
			name: Partial<Record<Language, string>>,
			// 🎺 instrument, 🥁 intro and 🥁🎺 are all windows into this one file
			instrument?: Recording,
			// 🎤, one singer
			vocal?: Recording,
			// 👥, a chorus
			choral?: Recording,
			// 🎼
			score?: Score,
			// which languages the anthem's words are on file in. The text itself
			// lives outside the bundle, one file per language, at
			// `public/lyrics/<code>/<language>.txt` — the same shape as the sound
			// folders. A country with more than one official version (Belgium,
			// Switzerland) lists each. Only lyrics old enough to be public domain
			// are carried; several anthems in this project are still in copyright.
			lyrics?: NativeLanguage[],
			composed?: string, // ISO date 'yyyy-mm-dd', 'yyyy-mm' or 'yyyy'
			adopted?: string, // ISO date 'yyyy-mm-dd', 'yyyy-mm' or 'yyyy' some countries have no adoption day
		},
    // when true, only shown in development / beta builds, hidden in production
    beta?: boolean,
}
