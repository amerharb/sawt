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

// 1: no sound file has been replaced in place since the cache was added.
export const {
	idbGet,
	idbHas,
	idbPut,
	idbCount,
	idbClear,
	getAudioBlob,
	ensureCached,
} = createAudioCache('dino-audio', 1)
