// the languages the numbers are *spoken* in
export type Language =
	| 'ar' | 'de' | 'el' | 'en' | 'es' | 'fa' | 'fi' | 'fr' | 'he' | 'ru' | 'sv' | 'tr'

export type Digit = {
	// '0', '21', '1000000' — the sound file name, and the code a link or a room uses
	code: string,
	// the same thing as a number, for arithmetic and ordering
	value: number,
	// the digit's word in each language it is recorded in. Zero to twenty have
	// all twelve; the numbers past twenty are English's alone for now. A digit
	// is on the board only in a language that names it, so no card is silent
	name: Partial<Record<Language, string>>,
	// when true, only shown in development / beta builds, hidden in production
	beta?: boolean,
}

// whether the digit has a recording in this language
export const spokenIn = (d: Digit, lang: Language) => d.name[lang] !== undefined
