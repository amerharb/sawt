/*
 * Every language in the app, defined once — two independent sets and their
 * union:
 *
 * - SoundLanguage — the languages country names are recorded in. Everything
 *   this type touches (the hearing dropdown, the /sound/lang/<code>/ URLs,
 *   the per-country `sounds` field) has files on disk behind it.
 * - UiLanguage — the interface languages, each with a full dictionary in
 *   src/i18n. Five of them are also sound languages; el/th/zh are not.
 * - AllLanguage — their union, and the key set of every country's `name`
 *   record: thirteen names per country, ten hearable and three display-only.
 */
export type SoundLanguage = 'en' | 'ar' | 'de' | 'sv' | 'da' | 'sq' | 'pt' | 'tr' | 'fa' | 'uk'
export type UiLanguage = 'en' | 'ar' | 'de' | 'el' | 'sv' | 'th' | 'tr' | 'zh'
export type AllLanguage = SoundLanguage | UiLanguage
