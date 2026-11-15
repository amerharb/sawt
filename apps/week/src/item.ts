import { UiLanguage } from './i18n'

// the languages the names are *spoken* in
export type Language = 'en' | 'ar' | 'de' | 'sv' | 'uk' | 'he' | 'el' | 'tr'

/*
 * One thing on the timeline that has a name and a sound: a day, a month or a
 * season. The name is needed in every interface language, which labels the
 * timeline, and in every spoken one, which the display shows while it is
 * heard — so a language added to either list is a type error until every item
 * has its word.
 */
export type Item = {
	// the sound file name and the code a room deals: '1'…'7', 'm1'…'m12', 'winter'…
	code: string,
	name: Record<UiLanguage | Language, string>,
	// when true, only shown in development / beta builds, hidden in production
	beta?: boolean,
}
