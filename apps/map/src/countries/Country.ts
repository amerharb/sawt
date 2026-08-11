import { AllLanguage, SoundLanguage } from '../languages'

export type Country = {
	code: string,
	// all thirteen names, keyed by AllLanguage — see src/languages.ts: the ten
	// sound languages plus the three interface-only ones (el/th/zh), which are
	// names to read with no recording behind them
	name: Record<AllLanguage, string>,
	// the languages this country is actually recorded in; absent = all of them.
	// A country outside the selected hearing language goes grey on the map
	// rather than clicking silently.
	sounds?: SoundLanguage[],
	flag: string,
	// when true, only shown in development / beta builds, hidden in production
	beta?: boolean,
}

// whether the country's name is recorded in the given language
export function hasSound(c: Country, lang: SoundLanguage): boolean {
	return !c.sounds || c.sounds.includes(lang)
}
