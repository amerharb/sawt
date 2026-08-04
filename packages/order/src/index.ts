/*
 * How the board is ordered: the main screen's sort, and the shuffle behind both
 * the frozen random order and the game's board.
 *
 * No React and no app types — every app's item happens to have a `code`, but
 * their `name` maps are keyed by that app's own language union
 * (`Record<Language, string>`), which is not assignable to a shared
 * `Record<string, string>`. So the name is read through an accessor the caller
 * supplies rather than a shared shape.
 */

/** A new array in random order (Fisher–Yates); the input is left alone. */
export function shuffle<T>(items: T[]): T[] {
	const out = items.slice()
	for (let i = out.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[out[i], out[j]] = [out[j], out[i]]
	}
	return out
}

export type SortOptions<T> = {
	/*
	 * 'name' sorts by name, 'random' follows `randomOrder`, and anything else —
	 * including 'code' — sorts by code.
	 *
	 * Deliberately a string rather than a union: it comes straight from a stored
	 * setting, so it can hold a value this version no longer writes. 'lang' is
	 * accepted as the pre-0.20.0 name for 'name', so an existing preference is
	 * not silently downgraded to code order.
	 */
	mode: string,
	/*
	 * The frozen random order, as codes. Covers every item including hidden ones,
	 * so an item keeps its slot when shown again. Codes missing from it sort last.
	 */
	randomOrder: readonly string[],
	/*
	 * The name to sort by in 'lang' mode. Leave it out when no language is
	 * available — the sort then falls back to code rather than showing an
	 * arbitrary order.
	 */
	nameOf?: (item: T) => string,
	/** collation locale for the name sort, e.g. 'ar' */
	locale?: string,
}

/**
 * Order items for the main screen. Ties always break on `code`, so the result is
 * stable whichever mode is chosen.
 */
export function sortByCodeOrName<T extends { code: string }>(
	items: readonly T[],
	{ mode, randomOrder, nameOf, locale }: SortOptions<T>,
): T[] {
	const list = items.slice()
	const byCode = (a: T, b: T) => a.code.localeCompare(b.code)

	if ((mode === 'name' || mode === 'lang') && nameOf) {
		return list.sort((a, b) => nameOf(a).localeCompare(nameOf(b), locale) || byCode(a, b))
	}
	if (mode === 'random') {
		const pos = (code: string) => {
			const i = randomOrder.indexOf(code)
			return i === -1 ? Number.MAX_SAFE_INTEGER : i
		}
		return list.sort((a, b) => pos(a.code) - pos(b.code) || byCode(a, b))
	}
	return list.sort(byCode)
}
