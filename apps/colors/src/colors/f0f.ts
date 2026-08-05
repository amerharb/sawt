import { Color } from './Color'

/*
 * The loanword in Arabic, Ukrainian and Hebrew, as with Cyan in German, Swedish
 * and Hebrew: none of the three has a native basic term for #FF00FF.
 *
 * Arabic in particular separates three colours this palette would otherwise
 * blur — بنفسجي is spectral violet (#8000FF), أرجواني is non-spectral purple
 * (#800080) and ماجنتا is this one. أرجواني is therefore *not* a name for
 * magenta, tempting as it looks: it describes the darker 707 swatch.
 *
 * Ukrainian likewise treats Пурпуровий as the whole purple sector and Маджента
 * as this narrowed part of it, so the broader word would be wrong here.
 */
export const magenta: Color = {
	code: 'f0f',
	name: {
		en: 'Magenta',
		ar: 'ماجنتا',
		de: 'Magenta',
		sv: 'Magenta',
		uk: 'Маджента',
		he: 'מג\'נטה',
	},
}
