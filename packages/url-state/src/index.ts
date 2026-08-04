/*
 * The URL parameters every app understands, for a shareable deep link.
 *
 *   ?i=us,de     items visible          (only where items are hideable)
 *   ?l=ar        interface language     (single)
 *   ?s=ar,en     sounds visible, first one selected
 *   ?t=dark      theme
 *
 * "Sound" is the axis that decides which audio an item produces: a spoken
 * language in most apps, an anthem rendering in Anthem — where it is a single
 * choice rather than a visible set.
 *
 * Every value is validated against what the app actually has, and **a parameter
 * that survives validation with nothing left is dropped**. That matters: before
 * this, `?f=typo` hid every item, left a blank screen with no explanation, and
 * the next settings change wrote that empty state to localStorage — so the app
 * stayed blank even after the parameter was removed. Ignoring an unusable
 * parameter turns a bricked app into a link that merely does nothing.
 */

export type Theme = 'system' | 'light' | 'dark'

const THEMES: readonly Theme[] = ['system', 'light', 'dark']

export type UrlState = {
	// codes of the items to show; absent when the parameter was missing or unusable
	items?: string[],
	// codes of the sounds to show, in the order given — the first is selected
	sounds?: string[],
	uiLanguage?: string,
	theme?: Theme,
}

export type ValidCodes = {
	items?: readonly string[],
	sounds?: readonly string[],
	uiLanguages: readonly string[],
}

/*
 * Split a comma-separated parameter into known codes, in the order written,
 * without duplicates. Returns undefined when nothing usable is left, so callers
 * can tell "not asked for" from "asked for nonsense" — both mean: leave the
 * app's own settings alone.
 */
function codeList(raw: string | null, valid: readonly string[] | undefined): string[] | undefined {
	if (raw === null || valid === undefined) return undefined
	const known = new Set(valid)
	const out: string[] = []
	for (const part of raw.split(',')) {
		const code = part.trim()
		if (code && known.has(code) && !out.includes(code)) out.push(code)
	}
	return out.length > 0 ? out : undefined
}

export function readUrlParams(search: string, valid: ValidCodes): UrlState {
	const params = new URLSearchParams(search)
	const state: UrlState = {}

	const items = codeList(params.get('i'), valid.items)
	if (items) state.items = items

	const sounds = codeList(params.get('s'), valid.sounds)
	if (sounds) state.sounds = sounds

	// one interface language, not a set; extra values are ignored rather than
	// treated as an error, so a stale link still resolves to something sensible
	const ui = codeList(params.get('l'), valid.uiLanguages)
	if (ui) state.uiLanguage = ui[0]

	const t = params.get('t')?.trim()
	if (t && (THEMES as readonly string[]).includes(t)) state.theme = t as Theme

	return state
}

/*
 * Which codes to hide, given the ones a link asked to show. Kept here so every
 * app inverts the list the same way.
 */
export function hiddenFrom(all: readonly string[], visible: readonly string[]): string[] {
	return all.filter(code => !visible.includes(code))
}
