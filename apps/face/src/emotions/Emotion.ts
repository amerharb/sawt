// The languages a feeling can be heard in — the content languages, independent
// of the interface languages in src/i18n.
export type Language = 'en' | 'ar' | 'de' | 'sv'

export type Emotion = {
	// a short English slug — doubles as the sound file name and the `?i=` value
	code: string,
	// the face itself. Rendered with the platform's emoji font for now, which
	// means the faces differ between systems — the fix is the one Flags used, a
	// custom webfont scoped to `.face-emoji`, planned but not drawn yet.
	emoji: string,
	name: Record<Language, string>,
	// when true, only shown in development / beta builds, hidden in production
	beta?: boolean,
}
