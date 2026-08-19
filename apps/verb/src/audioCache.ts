/*
 * This app's sound-and-animation cache. The implementation is shared — see
 * `packages/audio-cache` — and each app owns its own IndexedDB database, so one
 * app's 🗑️ never clears another's files while they share localhost in dev.
 *
 * Besides the recordings this cache also holds the animations
 * (public/anim/<code>.svg), the same way Map caches its world.json — so ✈️
 * makes the whole app work offline. The shared cache refuses HTML, so a dev
 * server's index.html fallback can never be stored as a sound or an animation.
 */
import { createAudioCache } from '@sawt/audio-cache'

export const {
	idbGet,
	idbHas,
	idbPut,
	idbCount,
	idbClear,
	getAudioBlob,
	ensureCached,
} = createAudioCache('verb-audio', 1)
