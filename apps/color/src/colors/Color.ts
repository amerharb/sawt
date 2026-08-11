export type Language = 'en' | 'ar' | 'de' | 'sv' | 'uk' | 'he'

export type Color = {
	// three digits, one per channel, each a step on the ladder below — so `808`
	// is the purple `#800080`. Doubles as the sound file name and the `?i=` value.
	code: string,
	name: Record<Language, string>,
	// when true, only shown in development / beta builds, hidden in production
	beta?: boolean,
}

/*
 * The five steps a channel can take: nothing, a quarter, half, three quarters,
 * everything.
 *
 * Deliberately not CSS's own three-digit shorthand, which repeats each digit and
 * so can only reach 00, 44, 88, CC, FF. Half intensity would land on 88 (136)
 * instead of 80 (128) — grey would read warm rather than neutral, and violet
 * could not be the #8000FF that Arabic بنفسجي and the sister apps mean by it.
 * Writing the steps out here keeps the codes short and the colours exact.
 */
const CHANNEL: Record<string, string> = {
	'0': '00',
	'4': '40',
	'8': '80',
	'c': 'bf',
	'f': 'ff',
}

/** A code as a CSS colour: `808` → `#800080`. */
export function cssColor(code: string): string {
	// an unknown digit falls back to CSS's own doubling rather than vanishing, so
	// a typo shows up as a wrong colour instead of an invisible swatch
	return '#' + [...code].map(d => CHANNEL[d] ?? d + d).join('')
}
