// the languages the numbers are *spoken* in
export type Language =
	| 'ar' | 'de' | 'el' | 'en' | 'es' | 'fa' | 'fi' | 'fr' | 'he' | 'ru' | 'sv' | 'tr'

export type Digit = {
	// '0'..'15' — the button face and the sound file name
	code: string,
	// the same thing as a number, for arithmetic and ordering
	value: number,
	// the digit's word in every spoken language
	name: Record<Language, string>,
	// when true, only shown in development / beta builds, hidden in production
	beta?: boolean,
}
