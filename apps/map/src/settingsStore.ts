/*
 * User settings, persisted in localStorage (not cookies: this is a front-end
 * only app, so there's no server that needs them, and localStorage avoids
 * sending the data on every request). Stored as one JSON blob under STORAGE_KEY
 * so new settings can be added over time without new storage keys.
 */
import { SoundLanguage, UiLanguage } from './languages'

export type Theme = 'system' | 'light' | 'dark'

export type Settings = {
	theme: Theme,
	// the interface language (button tooltips, settings labels): one of the eight
	// localized languages, independent of the content (country-name) language
	uiLanguage: UiLanguage,
	// codes the user chose to hide from the main screen; empty = show everything,
	// so newly added languages/countries are visible by default
	hiddenLanguages: SoundLanguage[],
	hiddenCountries: string[],
	// how many targets one game round asks before it ends; 0 plays them all
	roundLength: number,
	// with a round length set, deal the round: only the round's countries play
	// and the rest sit out grey (as if deselected) instead of counting wrong
	dealRound: boolean,
	// frame the map on the countries in play — the selected ones while
	// learning, the round's own board in a game — instead of the whole world.
	// On by default: with everything selected the frame is the whole world
	// anyway, so it only shows itself once the choice narrows
	zoomToFit: boolean,
	// when on, all visible sounds are downloaded to the cache, and newly shown
	// languages/countries are cached as soon as they are enabled
	flightMode: boolean,
}

// No sort and no random order here, unlike the sibling apps: the countries sit
// where geography put them.

export const DEFAULT_SETTINGS: Settings = {
	theme: 'system',
	uiLanguage: 'en',
	hiddenLanguages: [],
	hiddenCountries: [],
	flightMode: false,
	roundLength: 20,
	dealRound: false,
	zoomToFit: true,
}

const STORAGE_KEY = 'map:settings'

// how many targets one game round can ask, as ⚙️ offers them: a short game,
// a longer one, a long one, or 0 — the whole board (∞)
export const ROUND_LENGTHS: readonly number[] = [10, 20, 50, 0]

/*
 * What a signed-in player's account keeps for Map (see useBaabSettings in
 * @sawt/game): everything but flight mode, which is about the sounds and the
 * map this device has downloaded, not about the player.
 */
const SYNCED = ['theme', 'uiLanguage', 'hiddenLanguages', 'hiddenCountries', 'roundLength', 'dealRound', 'zoomToFit'] as const
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
 * rather than applied: a theme it has no name for, a country it does not
 * draw, a language it has no dictionary for, a round length ⚙️ has no button
 * for. `skip` names fields this page load already chose — a shared link's
 * countries, say — which baab's copy must not undo.
 */
export function fromSaved(
	saved: Record<string, unknown>,
	current: Settings,
	known: { uiLanguages: readonly string[], languages: readonly string[], countries: readonly string[] },
	skip: ReadonlySet<SyncedKey> = new Set(),
): Settings {
	const next = { ...current }
	const take = (key: SyncedKey) => !skip.has(key) && key in saved
	if (take('theme') && THEMES.includes(saved.theme as Theme)) next.theme = saved.theme as Theme
	if (take('uiLanguage') && known.uiLanguages.includes(saved.uiLanguage as string)) {
		next.uiLanguage = saved.uiLanguage as UiLanguage
	}
	const languages = take('hiddenLanguages') ? strings(saved.hiddenLanguages) : null
	if (languages) next.hiddenLanguages = languages.filter(code => known.languages.includes(code)) as SoundLanguage[]
	const countries = take('hiddenCountries') ? strings(saved.hiddenCountries) : null
	if (countries) next.hiddenCountries = countries.filter(code => known.countries.includes(code))
	if (take('roundLength') && ROUND_LENGTHS.includes(saved.roundLength as number)) {
		next.roundLength = saved.roundLength as number
	}
	if (take('dealRound') && typeof saved.dealRound === 'boolean') next.dealRound = saved.dealRound
	if (take('zoomToFit') && typeof saved.zoomToFit === 'boolean') next.zoomToFit = saved.zoomToFit
	return next
}

// every content (sound) language, all visible from the first visit
const SPOKEN_LANGUAGES: SoundLanguage[] = ['sq', 'ar', 'da', 'en', 'de', 'fa', 'pt', 'sv', 'tr', 'uk']
// the interface languages we actually have translations for (a subset)
// map a BCP-47 tag to one of the interface languages, or null
function uiTagToCode(tag: string): UiLanguage | null {
	const primary = tag.toLowerCase().split('-')[0]
	return (UI_LANGUAGE_CODES as string[]).includes(primary) ? primary as UiLanguage : null
}

const UI_LANGUAGE_CODES: UiLanguage[] = ['en', 'ar', 'de', 'el', 'sv', 'th', 'tr', 'zh']

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
export function preferredSound(): SoundLanguage {
	const { uiLanguage } = loadSettings()
	return (SPOKEN_LANGUAGES as readonly string[]).includes(uiLanguage) ? uiLanguage as SoundLanguage : 'en'
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
