// the interface languages; they also key each country's display name (shown on a
// card when the display mode is "name"), so every country needs all of them.
export type Language = 'en' | 'ar' | 'de' | 'el' | 'sv' | 'th' | 'tr' | 'zh'

// The language the anthem itself is sung in (ISO 639-1, plus 'la' for Latin).
// Separate from the interface languages above — most anthems are in neither of
// them. Add a code here as countries are added. Where a country has several
// official languages (Belgium, Switzerland, Luxembourg) this is the one the
// recording is sung in.
export type NativeLanguage =
	| 'ar' | 'cs' | 'da' | 'de' | 'el' | 'en' | 'es' | 'fa' | 'fr' | 'hu'
	| 'it' | 'la' | 'lb' | 'nl' | 'no' | 'pl' | 'pt' | 'sq' | 'sv' | 'th'
	| 'tr' | 'uk'

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
			// where the anthem's intro ends, in seconds into the recording. The one
			// recording covers every instrumental rendering: 🥁 intro plays 0 → intro,
			// 🎺 instrument plays intro → end, 🥁🎺 plays the whole file.
			// 0 or absent means the anthem has no distinct intro.
			intro?: number,
			// true when a solo sung recording is available, at /sound/vocal/<code>.aac
			hasVocal?: boolean,
			// true when a choir recording is available, at /sound/choral/<code>.aac
			hasChoral?: boolean,
			// the melody as notes, synthesized live in the browser instead of
			// streaming a recording (see src/synth.ts for the format)
			score?: { tempo: number, melody: string },
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
