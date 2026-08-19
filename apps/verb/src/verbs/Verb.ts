// The languages a verb can be heard in — the content languages, independent
// of the interface languages in src/i18n.
export type Language = 'en' | 'ar' | 'de' | 'sv'

export type Verb = {
	// a short English slug — doubles as the animation file name
	// (public/anim/<code>.svg), the sound file name and the `?i=` value
	code: string,
	// a plain emoji standing in for the verb where the animation would be too
	// much: the settings checklist and other compact spots
	emoji: string,
	name: Record<Language, string>,
	// when true, only shown in development / beta builds, hidden in production
	beta?: boolean,
}
