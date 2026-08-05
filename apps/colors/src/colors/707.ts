import { Color } from './Color'

/*
 * Non-spectral purple, #770077. Three languages held the *violet* word here until
 * 0.20.0 — بنفسجي, Фіолетовий and סגול all name #8000FF, which the palette only
 * gained as 70f. Each moved there, and this swatch took its own word: أرجواني,
 * Пурпуровий, ארגמן.
 *
 * German and Swedish are the exception and keep Lila. Their purple word, Purpur,
 * is a redder and more literary colour than this, while Lila is what anyone
 * actually calls it — and Violett was free for 70f without moving anything.
 */
export const purple: Color = {
	code: '707',
	name: {
		en: 'Purple',
		ar: 'أرجواني',
		de: 'Lila',
		sv: 'Lila',
		uk: 'Пурпуровий',
		he: 'ארגמן',
	},
}
