import { Color } from './Color'

/*
 * Spectral violet, exactly #8000FF. It differs from أرجواني 800080 only in the
 * blue channel, which is precisely the relationship the two words describe.
 *
 * German and Swedish keep Lila on 800080 rather than moving to Purpur: Lila is
 * the everyday word for that purple, while Purpur is a redder, more literary
 * colour. Violett is free and accurate for this one.
 */
export const violet: Color = {
	code: '80f',
	name: {
		en: 'Violet',
		ar: 'بنفسجي',
		de: 'Violett',
		sv: 'Violett',
		uk: 'Фіолетовий',
		he: 'סגול',
	},
}
