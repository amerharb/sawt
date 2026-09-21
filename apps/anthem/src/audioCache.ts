/*
 * This app's sound cache. The implementation is shared — see
 * `packages/audio-cache` — and each app owns its own IndexedDB database, so one
 * app's 🗑️ never clears another's sounds while they share localhost in dev.
 */
import { createAudioCache } from '@sawt/audio-cache'

// 5: ps, sy and cz lost the five seconds of silence each carried after the
// last chord. ps was beta and nobody had it; sy and cz are why this moves.
// 4: twelve recordings lost the dead air at their head — up to 1.6 s of room
// tone before the first note, which a child waiting to guess heard as nothing
// at all. Belgium's, Italy's and Turkey's intro points moved with them.
// 3: va was trimmed — the Vatican recording carried fifteen seconds of silence
// after the last chord, which the 🎺 rendering played through to the end.
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
} = createAudioCache('anthem-audio', 5)
