// the languages a country name is spoken in
export type Language = 'en' | 'ar' | 'de' | 'sv' | 'da' | 'sq' | 'pt' | 'tr' | 'fa' | 'uk'

export type Country = {
    code: string,
    name: Record<Language, string>,
    // the languages this country is actually recorded in; absent = all of them.
    // A country outside the selected hearing language shows disabled rather
    // than playing nothing.
    sounds?: Language[],
    flag: string,
    // when true, only shown in development / beta builds, hidden in production
    beta?: boolean,
}

// whether the country's name is recorded in the given language
export function hasSound(c: Country, lang: Language): boolean {
	return !c.sounds || c.sounds.includes(lang)
}
