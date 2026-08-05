import { Color } from './Color'

/*
 * Spectral violet. Requested as #8000FF, which three-digit shorthand cannot hold
 * exactly — 70f is #7700FF and 80f is #8800FF. 70f wins on two counts: it shares
 * the palette's existing digit vocabulary (0/3/7/b/f — no other colour uses 8),
 * and it differs from أرجواني 707 only in the blue channel, which is precisely
 * the relationship the two words describe.
 *
 * German and Swedish keep Lila on 707 rather than moving to Purpur: Lila is the
 * everyday word for that purple, while Purpur is a redder, more literary colour.
 * Violett is free and accurate for this one.
 */
export const violet: Color = {
	code: '70f',
	name: {
		en: 'Violet',
		ar: 'بنفسجي',
		de: 'Violett',
		sv: 'Violett',
		uk: 'Фіолетовий',
		he: 'סגול',
	},
}
