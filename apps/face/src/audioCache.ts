/*
 * This app's sound cache. The implementation is shared — see
 * `packages/audio-cache` — and each app owns its own IndexedDB database, so one
 * app's 🗑️ never clears another's sounds while they share localhost in dev.
 */
import { createAudioCache } from '@sawt/audio-cache'

// 2: version 1 caches could hold Vite's index.html where the recordings now
// are — the app briefly ran before its sound files existed, and the dev server
// answers a missing file with the HTML fallback and a 200. The raise discards
// those entries; the shared cache now also refuses to store HTML at all.
export const {
	idbGet,
	idbHas,
	idbPut,
	idbCount,
	idbClear,
	getAudioBlob,
	ensureCached,
} = createAudioCache('face-audio', 2)
