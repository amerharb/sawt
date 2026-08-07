/*
 * The URL parameters every app understands, for a shareable deep link.
 *
 *   ?i=us,de     items visible          (only where items are hideable)
 *   ?i=0-9       …or a range, for an app whose items are one ordered run
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
	// in the app's own order — that order is what a range refers to
	items?: readonly string[],
	/*
	 * Also accept `?i=` as a range (`0-9`, `10-12`), for an app whose items are one
	 * ordered run. A single value (`?i=5`) is a range of one.
	 *
	 * The range is a shorthand, not a replacement: a comma anywhere means the value
	 * is read as a list, because a hand-picked set (`0,1,5`) is not a range and has
	 * to survive the round trip through writeUrlParams.
	 *
	 * Endpoints are resolved by position in `items`, not by comparing the codes:
	 * digits are strings, and '10' sorts before '9'. Only safe where no code itself
	 * contains a hyphen — Flags' `gb-sct` is why this is opt-in.
	 */
	itemsAsRange?: boolean,
	sounds?: readonly string[],
	uiLanguages: readonly string[],
}

/*
 * Expand "0-9" (or "5") into the codes it covers, in the app's order. Returns
 * undefined unless both endpoints are known items, so a range that runs off the
 * end is ignored rather than silently clamped to something the link did not ask
 * for. Reversed endpoints are accepted and swapped.
 */
function codeRange(raw: string | null, items: readonly string[] | undefined): string[] | undefined {
	if (raw === null || items === undefined) return undefined
	const parts = raw.trim().split('-').map(s => s.trim())
	if (parts.length > 2 || parts.some(s => !s)) return undefined
	const from = items.indexOf(parts[0])
	const to = items.indexOf(parts[parts.length - 1])
	if (from === -1 || to === -1) return undefined
	const [lo, hi] = from <= to ? [from, to] : [to, from]
	return items.slice(lo, hi + 1)
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

	const rawItems = params.get('i')
	const asRange = valid.itemsAsRange && rawItems !== null && !rawItems.includes(',')
	const items = asRange
		? codeRange(rawItems, valid.items)
		: codeList(rawItems, valid.items)
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

export type ShareState = {
	/*
	 * `all` in the app's own order, `visible` the subset on screen. Leave the whole
	 * field out in an app with nothing hideable (Week, whose seven days are fixed).
	 */
	items?: { all: readonly string[], visible: readonly string[], asRange?: boolean },
	// `visible` with the selected one first, matching how `?s=` is read back
	sounds?: { all: readonly string[], visible: readonly string[] },
	uiLanguage?: string,
	theme?: Theme,
}

/*
 * True when `visible` is one unbroken run of `all`, in order — the only case a
 * range can describe without losing anything.
 */
function isContiguous(all: readonly string[], visible: readonly string[]): boolean {
	if (visible.length === 0) return false
	const at = visible.map(code => all.indexOf(code))
	if (at.includes(-1)) return false
	const lo = Math.min(...at)
	const hi = Math.max(...at)
	return hi - lo + 1 === visible.length
}

/*
 * Build the query string for a share link — the inverse of readUrlParams, so
 * whatever this writes reads back as the same state.
 *
 * A parameter is written only when it has something to say:
 *
 *   - `i` is skipped when nothing is hidden, since "all items" is what an app
 *     shows anyway. Emitting it would mean listing every code — all fifty-odd
 *     countries in Flags — to describe the default.
 *   - `t` is skipped for 'system', which means "follow the device" rather than a
 *     choice worth pinning on someone else's screen.
 *   - `s` and `l` are always written: the selected sound and the interface
 *     language are the state most worth sharing, and neither has a fixed default
 *     to compare against (both are derived from the visitor's own browser).
 *
 * The result starts with '?' and is '' when there is nothing to share.
 */
export function writeUrlParams({ items, sounds, uiLanguage, theme }: ShareState): string {
	const parts: string[] = []

	if (items && items.visible.length < items.all.length && items.visible.length > 0) {
		// a range only when it loses nothing; a hand-picked set falls back to a list
		const ordered = items.all.filter(code => items.visible.includes(code))
		parts.push(`i=${items.asRange && isContiguous(items.all, ordered) && ordered.length > 1
			? `${ordered[0]}-${ordered[ordered.length - 1]}`
			: ordered.join(',')}`)
	}

	if (uiLanguage) parts.push(`l=${uiLanguage}`)
	if (sounds && sounds.visible.length > 0) parts.push(`s=${sounds.visible.join(',')}`)
	if (theme && theme !== 'system') parts.push(`t=${theme}`)

	return parts.length > 0 ? `?${parts.join('&')}` : ''
}
