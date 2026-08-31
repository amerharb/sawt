/*
 * The one line in the courtyard that is composed rather than looked up: what
 * the room is being heard in. It is worth its own test because it is the last
 * gate on the only client-supplied string saha carries that is not an item
 * code — a room's sound id — and the rule is that the id itself never reaches
 * a child's screen.
 */
import { describe, it, expect } from 'vitest'

import { soundLine } from './RaceHud'

// a translator that answers with the key, as the real one does for a string it
// has no entry for — enough to see which key was chosen
const t = (key: string) => key
// the app's own list, the only source of a name a child may be shown
const NAMES: Record<string, string> = { ar: 'Arabic', sv: 'Swedish' }
const name = (id: string) => NAMES[id] ?? ''

describe('what the room is heard in', () => {
	it('says whose language it is when the app knows the name', () => {
		expect(soundLine(t, 'ar', name)).toBe('🔒 race.hears Arabic')
	})

	it('is a plain 🔓 when everybody hears their own', () => {
		expect(soundLine(t, null, name)).toBe('🔓 race.hearsOwn')
	})

	it('never prints a sound id it cannot name', () => {
		/*
		 * The safety rule. A room's sound is a string another child's app chose,
		 * and a build that has never heard of it must not put it on screen — but
		 * it must still say the room is held to *something*, or a child would
		 * think they were free to choose.
		 */
		const line = soundLine(t, 'kl', name)
		expect(line).toBe('🔒 race.hearsOne')
		expect(line).not.toContain('kl')
	})

	it('says the same for an app with no sounds of its own to name', () => {
		// no resolver at all: an app whose sound is not a choice
		expect(soundLine(t, 'ar')).toBe('🔒 race.hearsOne')
		expect(soundLine(t, null)).toBe('🔓 race.hearsOwn')
	})
})
