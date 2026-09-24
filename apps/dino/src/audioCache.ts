/*
 * This app's sound cache. The implementation is shared — see
 * `packages/audio-cache` — and each app owns its own IndexedDB database, so one
 * app's 🗑️ never clears another's sounds while they share localhost in dev.
 *
 * The dinosaur drawings live in here too, beside the recordings: they are
 * fetched the same way and ✈️ should take the pictures offline along with the
 * words.
 */
import { createAudioCache } from '@sawt/audio-cache'

/*
 * 4: two cards were mirrored in place to face right like the other eight —
 * the Gallimimus and the Pteranodon came from sources that face left.
 * 3: the cards were rebuilt at 800px when the board's cards doubled in size,
 * at the same five .webp paths — a cached blob wins over the network, so
 * without this raise a machine that had the 400px ones would keep drawing
 * them soft at twice the size.
 * 2: the three drawings were replaced in place — the hand-drawn originals
 * became the PhyloPic silhouettes at the same three paths.
 */
export const {
	idbGet,
	idbHas,
	idbPut,
	idbCount,
	idbClear,
	getAudioBlob,
	ensureCached,
} = createAudioCache('dino-audio', 4)
