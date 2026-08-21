/*
 * The moments — the points in time a verb can be spoken at. They are
 * deliberately not grammatical tenses: tenses differ per language and never
 * map one to one, but a moment is a situation every language has words for.
 * The scene names double as animation file names (public/anim/<code>.<scene>.svg).
 *
 * The animation behavior carries the meaning: do! loops anticipation and the
 * action never starts, doing loops the action forever, did plays the event
 * once before your eyes and rests, done never shows the action — only the
 * result it left behind.
 */
import { Language } from './verbs/Verb'

export type Scene = 'do' | 'doing' | 'did' | 'done'

// display order on the switch, and the full set of animation files per verb
export const SCENES: Scene[] = ['do', 'doing', 'did', 'done']

// the switch segments: ❗ do! · ⏳ doing (sand running) · ⏪ did · ⌛ done (sand out)
export const MOMENT_ICONS: Record<Scene, string> = {
	do: '❗',
	doing: '⏳',
	did: '⏪',
	done: '⌛',
}

/*
 * Which moments each language distinguishes. Arabic has no play-once past —
 * قد أكل adds nothing a child would ever hear, and the did animation is
 * ambiguous while it plays (it looks like doing) — so its ماضي speaks over
 * the done aftermath scene, the one picture that is unambiguously "past" at
 * every instant. German's did is Präteritum (aß) by the owner's choice; its
 * done is the spoken Perfekt.
 */
export const MOMENTS: Record<Language, Scene[]> = {
	en: ['do', 'doing', 'did', 'done'],
	ar: ['do', 'doing', 'done'],
	de: ['do', 'doing', 'did', 'done'],
	sv: ['do', 'doing', 'did', 'done'],
}

// when the selected language does not offer the current moment, fall to the
// nearest one that keeps the meaning (usually the same picture, new word)
export const FALLBACK: Record<Scene, Scene[]> = {
	do: ['doing'],
	doing: [],
	did: ['done', 'doing'],
	done: ['did', 'doing'],
}
