import { Item } from '../item'
import { UiLanguage } from '../i18n'

// 'm1'…'m12', January = m1
export type Month = Item & {
	// 0 = January … 11 = December, as Date counts them
	index: number,
	// what the line shows where the month is drawn. Arabic has no short forms,
	// so it repeats the name; where even this does not fit, the line shows the
	// month's number alone
	short: Record<UiLanguage, string>,
}
