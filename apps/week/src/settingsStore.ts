/*
 * User settings, persisted in localStorage (not cookies: this is a front-end
 * only app, so there's no server that needs them, and localStorage avoids
 * sending the data on every request). Stored as one JSON blob under STORAGE_KEY
 * so new settings can be added over time without new storage keys.
 */
import { UiLanguage } from './i18n'
import { Language } from './days/Day'

export type Theme = 'system' | 'light' | 'dark'

export type Settings = {
	theme: Theme,
	// the interface language: the day names shown on the cards, the first-day
	// dropdown labels, the layout direction (RTL for Arabic) and every UI string.
	// Independent of the content (sound) language chosen in the toolbar.
	uiLanguage: UiLanguage,
	// language codes the user chose to hide from the main screen; empty = show
	// everything, so newly added languages are visible by default
	hiddenLanguages: Language[],
	// when on, all visible sounds are downloaded to the cache, and newly shown
	// languages are cached as soon as they are enabled
	flightMode: boolean,
	// day code ('1'..'7') the week starts on; the cards are shown in week order
	// rotated so this day leads (default '1' = Sunday)
	firstDay: string,
}

export const DEFAULT_SETTINGS: Settings = {
	theme: 'system',
	uiLanguage: 'en',
	hiddenLanguages: [],
	flightMode: false,
	firstDay: '1',
}

const STORAGE_KEY = 'week:settings'

/*
 * What a signed-in player's account keeps for Week (see useBaabSettings in
 * @sawt/game): everything but flight mode, which is about the sounds this
 * device has downloaded, not about the player.
 */
const SYNCED = ['theme', 'uiLanguage', 'hiddenLanguages', 'firstDay'] as const
export type SyncedKey = typeof SYNCED[number]

// the settings as baab keeps them
export function toSaved(settings: Settings): Record<string, unknown> {
	return Object.fromEntries(SYNCED.map(key => [key, settings[key]]))
}

const THEMES: readonly Theme[] = ['system', 'light', 'dark']

const strings = (value: unknown): string[] | null =>
	Array.isArray(value) && value.every(v => typeof v === 'string') ? value : null

/*
 * The settings baab handed back, laid over `current`. Baab keeps
 * whatever an app once sent, from whichever build, so every field is checked
 * against what this build knows and a field that does not fit is passed over
 * rather than applied: a theme it has no name for, a language it has no
 * dictionary or no sounds for, a first day that is not one of its seven.
 * `skip` names fields this page load already chose — a shared link's
 * sounds, say — which baab's copy must not undo.
 */
export function fromSaved(
	saved: Record<string, unknown>,
	current: Settings,
	known: { uiLanguages: readonly string[], languages: readonly string[], days: readonly string[] },
	skip: ReadonlySet<SyncedKey> = new Set(),
): Settings {
	const next = { ...current }
	const take = (key: SyncedKey) => !skip.has(key) && key in saved
	if (take('theme') && THEMES.includes(saved.theme as Theme)) next.theme = saved.theme as Theme
	if (take('uiLanguage') && known.uiLanguages.includes(saved.uiLanguage as string)) {
		next.uiLanguage = saved.uiLanguage as UiLanguage
	}
	const languages = take('hiddenLanguages') ? strings(saved.hiddenLanguages) : null
	if (languages) next.hiddenLanguages = languages.filter(code => known.languages.includes(code)) as Language[]
	if (take('firstDay') && known.days.includes(saved.firstDay as string)) next.firstDay = saved.firstDay as string
	return next
}

// every content (sound) language, all visible from the first visit
const SPOKEN_LANGUAGES: Language[] = ['en', 'ar', 'de', 'sv', 'uk', 'he', 'el', 'tr']
// the subset offered as interface languages (those with an i18n dictionary)
// map a BCP-47 tag to one of the interface languages, or null
function uiTagToCode(tag: string): UiLanguage | null {
	const primary = tag.toLowerCase().split('-')[0]
	return (UI_LANGUAGE_CODES as string[]).includes(primary) ? primary as UiLanguage : null
}

const UI_LANGUAGE_CODES: UiLanguage[] = ['en', 'ar', 'de', 'el', 'sv', 'th', 'tr', 'zh', 'he']

/*
 * The sound language to start on. It follows the interface language — read the app
 * in Swedish and you hear Swedish — falling back to English when we have no sounds
 * in that language.
 *
 * Deliberately not taken from the browser. A browser language list says which
 * languages someone reads, which is a fair guess for the interface but a poor one
 * for what they came here to hear: a Swedish speaker learning Arabic sets their
 * browser to Swedish either way.
 */
export function preferredSound(): Language {
	const { uiLanguage } = loadSettings()
	return (SPOKEN_LANGUAGES as readonly string[]).includes(uiLanguage) ? uiLanguage as Language : 'en'
}

// the first-run interface language: the browser's primary language if we have a
// dictionary for it, else the first of its other languages that we do, else English
export function preferredUiLanguage(): UiLanguage {
	const primary = uiTagToCode((typeof navigator !== 'undefined' && navigator.language) || '')
	if (primary) return primary
	const tags = (typeof navigator !== 'undefined' && navigator.languages) || []
	for (const tag of tags) {
		const m = uiTagToCode(tag)
		if (m) return m
	}
	return 'en'
}

// first-run settings: every sound visible. Only the interface language follows the
// browser (see preferredUiLanguage); which sounds someone wants is not something a
// browser locale can answer, and guessing it used to start most visitors off with
// most of the app hidden.
function firstRunSettings(): Settings {
	return { ...DEFAULT_SETTINGS, uiLanguage: preferredUiLanguage() }
}

export function loadSettings(): Settings {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (raw) {
			return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
		}
	} catch {
		// localStorage may be unavailable (e.g. private mode); fall back to defaults
	}
	// no saved settings: derive first-run visibility from the browser's languages
	return firstRunSettings()
}

export function saveSettings(settings: Settings): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
	} catch {
		// ignore: settings still apply for the current session
	}
}

// Drive the CSS `color-scheme` via the data-theme attribute on <html>.
export function applyTheme(theme: Theme): void {
	const root = document.documentElement
	if (theme === 'system') {
		root.removeAttribute('data-theme')
	} else {
		root.setAttribute('data-theme', theme)
	}
}
