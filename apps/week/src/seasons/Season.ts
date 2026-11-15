import { Item } from '../item'

export type SeasonCode = 'winter' | 'spring' | 'summer' | 'autumn'

// the code is the season itself: in the south it is drawn over other months,
// but it is the same summer, with the same name and sound
export type Season = Item & { code: SeasonCode }
