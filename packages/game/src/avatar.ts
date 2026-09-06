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

/*
 * One colour per animal, and saha knows nothing about them — it deals in
 * indices, and this is the app's own reading of index 3.
 *
 * They exist for Map, where a won country is filled in with the colour of
 * whoever took it, so a finished board is a map of the race. That is what sets
 * the rules for the palette:
 *
 *   · Distinct first, natural second. A fox is orange and a frog is green
 *     because those were free; the koala is indigo because a second grey next
 *     to the panda would cost more than the likeness is worth.
 *   · Mid-tone and saturated, all twelve. Nothing near-black (invisible on a
 *     dark map) and nothing near-white (indistinguishable from a country
 *     nobody has taken), which is why the panda is slate rather than black.
 *   · One value, not a light/dark pair. A fill has to mean the same child in
 *     both themes, and a colour that changes with the theme is a colour two
 *     children on two devices would describe differently.
 */
export const AVATAR_COLORS = [
	'#e8590c', // 🦊 orange
	'#fab005', // 🦁 yellow
	'#ae3ec9', // 🐱 grape
	'#1c7ed6', // 🐶 blue
	'#a1683a', // 🐻 brown
	'#d6336c', // 🐹 raspberry
	'#4263eb', // 🐨 indigo
	'#2f9e44', // 🐸 green
	'#0ca678', // 🐰 teal
	'#f06595', // 🐷 pink
	'#495057', // 🐼 slate
	'#74b816', // 🐵 lime
]

/** The colour worn by an avatar, or a neutral for an index from the future. */
export const avatarColor = (i: number): string => AVATAR_COLORS[i] ?? '#868e96'

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
