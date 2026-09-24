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
 * 2: the three drawings were replaced in place — the hand-drawn originals
 * became the PhyloPic silhouettes at the same three paths. Nobody outside
 * this repo had ever cached version 1, since the app has not shipped, but a
 * dev machine that ran it had — and a cached blob wins over the network, so
 * without this raise the old pictures would have stayed on screen.
 */
export const {
	idbGet,
	idbHas,
	idbPut,
	idbCount,
	idbClear,
	getAudioBlob,
	ensureCached,
} = createAudioCache('dino-audio', 2)
