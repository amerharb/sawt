/*
 * User settings, persisted in localStorage (not cookies: this is a front-end
 * only app, so there's no server that needs them, and localStorage avoids
 * sending the data on every request). Stored as one JSON blob under STORAGE_KEY
 * so new settings can be added over time without new storage keys.
 */
import { Language } from './countries/Country'

export type Theme = 'system' | 'light' | 'dark'

// what each card shows: the country's flag emoji, or its name (in the UI language)
export type DisplayMode = 'flag' | 'name'

// how the cards are ordered on the main screen:
//   'code'   — by ISO country code (the default)
//   'name'   — by the country's name. Anthem's names are keyed by interface
//              language, and its sound is a rendering rather than a language, so
//              this follows the UI language — unlike Flags and Colors, where the
//              names live per spoken language
//   'random' — a fixed random order (see Settings.randomOrder)
export type SortMode = 'code' | 'name' | 'random'

export type Settings = {
	theme: Theme,
	// the interface language (button tooltips, settings labels, and — in "name"
	// display mode — the country names on the cards): English or Arabic
	uiLanguage: Language,
	// how each card is shown on the main screen
	displayMode: DisplayMode,
	// country codes the user chose to hide; empty = show everything, so newly
	// added countries are visible by default
	hiddenCountries: string[],
	// how many targets one game round asks before it ends; 0 plays them all
	roundLength: number,
	// when on, all visible anthems are downloaded to the cache, and newly shown
	// countries are cached as soon as they are enabled
	flightMode: boolean,
	// order the cards are shown in on the main screen
	sortMode: SortMode,
	// the frozen random order (country codes) used when sortMode === 'random'.
	// covers every country, including hidden ones, so a card keeps its slot when shown.
	randomOrder: string[],
}

export const DEFAULT_SETTINGS: Settings = {
	theme: 'system',
	uiLanguage: 'en',
	displayMode: 'flag',
	hiddenCountries: [],
	flightMode: false,
	roundLength: 20,
	sortMode: 'code',
	randomOrder: [],
}

const STORAGE_KEY = 'anthem:settings'

// the interface languages we have translations for
const UI_LANGUAGE_CODES: Language[] = ['en', 'ar', 'de', 'el', 'sv', 'th', 'tr', 'zh']

// map a BCP-47 tag (e.g. "en-US", "ar") to a supported UI language, or null
function tagToCode(tag: string, set: readonly Language[]): Language | null {
	const primary = tag.toLowerCase().split('-')[0]
	return (set as string[]).includes(primary) ? primary as Language : null
}

// the first-run interface language: the browser's primary language if supported,
// then the first of its other languages that is supported, else English
export function preferredUiLanguage(): Language {
	const primary = tagToCode((typeof navigator !== 'undefined' && navigator.language) || '', UI_LANGUAGE_CODES)
	if (primary) return primary
	const tags = (typeof navigator !== 'undefined' && navigator.languages) || []
	for (const tag of tags) {
		const m = tagToCode(tag, UI_LANGUAGE_CODES)
		if (m) return m
	}
	return 'en'
}

// first-run settings: all countries visible; the UI language follows the browser
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
	// no saved settings: derive the first-run interface language from the browser
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
