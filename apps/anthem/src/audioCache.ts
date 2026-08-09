/*
 * This app's sound cache. The implementation is shared — see
 * `packages/audio-cache` — and each app owns its own IndexedDB database, so one
 * app's 🗑️ never clears another's sounds while they share localhost in dev.
 */
import { createAudioCache } from '@sawt/audio-cache'

// 2: the fr and gb recordings were replaced with the US Navy Band ones. gb went
// 49.7s -> 62.9s and gained an `intro` of 11.8, which is what makes a stale copy
// visibly wrong rather than merely old: 11.8 lands a quarter of the way into a
// recording whose anthem starts at ~0.1s, so 🥁 Intro plays anthem instead of
// fanfare and 🎺 Instrument skips the first quarter of the tune.
export const {
	idbGet,
	idbHas,
	idbPut,
	idbCount,
	idbClear,
	getAudioBlob,
	ensureCached,
} = createAudioCache('anthem-audio', 2)
