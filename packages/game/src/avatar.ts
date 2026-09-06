/*
 * Which animal this child is, in every courtyard they walk into.
 *
 * It used to be a question the join screen asked, once per room. Now it is a
 * setting: chosen once (or picked at random on the first visit, so nobody has
 * to choose anything before they can play), remembered, and sent with every
 * `create` and `join`. The picker still exists — it appears when the animal
 * you wanted is already worn by someone in that room — but for most children
 * on most days it never has to.
 *
 * WHY THE LIST LIVES HERE and not behind a fetch, which is the change this
 * module represents: a settings screen has to open with no room, no socket
 * and possibly no network. saha still owns the list in the sense that matters
 * — it validates the index, and `welcome` carries its own copy so that
 * *other* children are drawn with the animals they actually chose, whatever
 * this build believes. What is here is the copy needed to ask the question.
 *
 * Keep it in step with `AVATARS` in saha's `src/model.rs`. If it ever falls
 * behind, this build simply offers fewer animals than the room can hold; if
 * it ever runs ahead, the server answers `badAvatar` and the picker opens.
 * Neither is silent, and neither breaks a round.
 */
export const AVATARS = [
	'🦊', '🦁', '🐱', '🐶', '🐻', '🐹', '🐨', '🐸', '🐰', '🐷', '🐼', '🐵',
]

const KEY = 'saha-avatar'

/** A whole number inside the list, or null for anything else. */
const readable = (value: string | null): number | null => {
	if (value === null) return null
	const i = Number(value)
	return Number.isInteger(i) && i >= 0 && i < AVATARS.length ? i : null
}

/*
 * Decided once per browser and then remembered. The first visit gets a random
 * animal rather than a default one, because a fox for everybody makes a
 * courtyard where the first two children in are both foxes — and because a
 * child who never opens the settings should still arrive as *somebody*.
 *
 * Memoised, so that a render which reads this twice gets the same answer even
 * when storage is refusing to keep it (a private window, a locked-down
 * browser). Without that a picker could redraw itself under a finger.
 */
let chosen: number | null = null

export function preferredAvatar(): number {
	if (chosen !== null) return chosen
	try {
		const stored = readable(localStorage.getItem(KEY))
		if (stored !== null) {
			chosen = stored
			return chosen
		}
	} catch {
		// storage unavailable; fall through and pick one for this session
	}
	chosen = Math.floor(Math.random() * AVATARS.length)
	remember(chosen)
	return chosen
}

export function setPreferredAvatar(i: number): void {
	if (readable(String(i)) === null) return
	chosen = i
	remember(i)
}

function remember(i: number): void {
	try {
		localStorage.setItem(KEY, String(i))
	} catch {
		// this browser will pick again next time, which is not worth a word
	}
}
