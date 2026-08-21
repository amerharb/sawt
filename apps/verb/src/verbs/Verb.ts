// The languages a verb can be heard in — the content languages, independent
// of the interface languages in src/i18n.
import type { Scene } from '../moments'

export type Language = 'en' | 'ar' | 'de' | 'sv'

export type Verb = {
	// a short English slug — doubles as the animation file name
	// (public/anim/<code>.<scene>.svg), the sound file name and the `?i=` value
	code: string,
	// a plain emoji standing in for the verb where an animation would be too
	// much: the settings checklist and other compact spots
	emoji: string,
	// per language, the word for each moment it distinguishes (see
	// src/moments.ts MOMENTS) — a scene missing here is a moment that language
	// does not offer
	name: Record<Language, Partial<Record<Scene, string>>>,
	// when true, only shown in development / beta builds, hidden in production
	beta?: boolean,
}
