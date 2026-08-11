/*
 * This app's sound cache. The implementation is shared — see
 * `packages/audio-cache` — and each app owns its own IndexedDB database, so one
 * app's 🗑️ never clears another's sounds while they share localhost in dev.
 *
 * Map also routes `world.json` through this cache (see App.tsx), so the map
 * itself works offline under ✈️. Two consequences: the 🔊 count in settings
 * includes it, and 🗑️ evicts it — both harmless, it is refetched on the next
 * load. Regenerating world.json in place needs a cacheVersion raise, exactly
 * like a re-recorded sound.
 */
import { createAudioCache } from '@sawt/audio-cache'

// 1: no file has been replaced in place since the cache was added.
export const {
	idbGet,
	idbHas,
	idbPut,
	idbCount,
	idbClear,
	getAudioBlob,
	ensureCached,
} = createAudioCache('map-audio', 1)
