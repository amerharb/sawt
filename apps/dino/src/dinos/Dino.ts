// The languages a dinosaur can be heard in — the content languages, independent
// of the interface languages in src/i18n.
export type Language = 'en' | 'de'

export type Dino = {
	// a lowercase slug — doubles as the drawing's file name
	// (public/dino/<code>.svg), the sound file name and the `?i=` value
	code: string,
	/*
	 * The name, per sound language. English and German spell all three alike —
	 * they are Latin either way — so the two recordings of a card differ only
	 * in how the word is said. That is the whole lesson here, and it is why the
	 * display keeps showing the name while the sound changes underneath it.
	 */
	name: Record<Language, string>,
	// when true, only shown in development / beta builds, hidden in production
	beta?: boolean,
}
