/*
 * User settings, persisted in localStorage (not cookies: this is a front-end
 * only app, so there's no server that needs them, and localStorage avoids
 * sending the data on every request). Stored as one JSON blob under STORAGE_KEY
 * so new settings can be added over time without new storage keys.
 */
export type Theme = 'system' | 'light' | 'dark'

export type Settings = {
	theme: Theme,
	// the interface language (button tooltips, settings labels): one of the eight
	// localized languages, independent of the content (number) language
	uiLanguage: string,
	// language codes the user chose to hide from the main screen; empty = show
	// everything, so newly added languages are visible by default
	hiddenLanguages: string[],
	// digit codes ('0'..'20') hidden from the board, for practising a smaller
	// range. Empty = show everything, so a newly added digit is visible by
	// default. Usually set by `?i=0-9`; adjustable in the settings panel so a
	// link cannot leave a digit permanently unreachable.
	hiddenDigits: string[],
	// when on, all visible sounds are downloaded to the cache, and newly shown
	// languages are cached as soon as they are enabled
	flightMode: boolean,
}

export const DEFAULT_SETTINGS: Settings = {
	theme: 'system',
	uiLanguage: 'en',
	hiddenLanguages: [],
	hiddenDigits: [],
	flightMode: false,
}

const STORAGE_KEY = 'number:settings'

/*
 * What a signed-in player's account keeps for Number (see useBaabSettings in
 * @sawt/game): everything but flight mode, which is about the sounds this
 * device has downloaded, not about the player.
 */
const SYNCED = ['theme', 'uiLanguage', 'hiddenLanguages', 'hiddenDigits'] as const
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
 * rather than applied: a theme it has no name for, a number it does not put
 * on the board, a language it has no dictionary for. `skip` names fields this
 * page load already chose — a shared link's range, say — which baab's copy
 * must not undo.
 */
export function fromSaved(
	saved: Record<string, unknown>,
	current: Settings,
	known: { uiLanguages: readonly string[], languages: readonly string[], digits: readonly string[] },
	skip: ReadonlySet<SyncedKey> = new Set(),
): Settings {
	const next = { ...current }
	const take = (key: SyncedKey) => !skip.has(key) && key in saved
	if (take('theme') && THEMES.includes(saved.theme as Theme)) next.theme = saved.theme as Theme
	if (take('uiLanguage') && known.uiLanguages.includes(saved.uiLanguage as string)) {
		next.uiLanguage = saved.uiLanguage as string
	}
	const languages = take('hiddenLanguages') ? strings(saved.hiddenLanguages) : null
	if (languages) next.hiddenLanguages = languages.filter(code => known.languages.includes(code))
	const digits = take('hiddenDigits') ? strings(saved.hiddenDigits) : null
	if (digits) next.hiddenDigits = digits.filter(code => known.digits.includes(code))
	return next
}

// every content (sound) language, all visible from the first visit
const SPOKEN_LANGUAGES = ['ar', 'en', 'de', 'sv', 'fr', 'tr', 'fa', 'ru', 'fi', 'es', 'he', 'el']
// the interface languages we actually have translations for (a subset)
const UI_LANGUAGE_CODES = ['en', 'ar', 'de', 'el', 'sv', 'th', 'tr', 'zh']

// map a BCP-47 tag (e.g. "en-US", "sv") to one of a set of codes, or null
function tagToCode(tag: string, set: string[]): string | null {
	const primary = tag.toLowerCase().split('-')[0]
	return set.includes(primary) ? primary : null
}

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
export function preferredSound(): string {
	const { uiLanguage } = loadSettings()
	return SPOKEN_LANGUAGES.includes(uiLanguage) ? uiLanguage : 'en'
}

// the first-run interface language: the browser's primary language if we have a
// dictionary for it, else the first of its other languages that we do, else English
export function preferredUiLanguage(): string {
	const primary = tagToCode((typeof navigator !== 'undefined' && navigator.language) || '', UI_LANGUAGE_CODES)
	if (primary) return primary
	const tags = (typeof navigator !== 'undefined' && navigator.languages) || []
	for (const tag of tags) {
		const m = tagToCode(tag, UI_LANGUAGE_CODES)
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
