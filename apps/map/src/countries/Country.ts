// the languages a country name is spoken in
export type Language = 'en' | 'ar' | 'de' | 'sv' | 'da' | 'sq' | 'pt' | 'tr' | 'fa' | 'uk'

// the interface languages that are NOT sound languages: hovering the map shows
// the name in the interface language, and for these three that name cannot come
// from `name` — el/th/zh have dictionaries but no recordings
export type LabelLanguage = 'el' | 'th' | 'zh'

export type Country = {
	code: string,
	name: Record<Language, string>,
	// hover names for the interface languages the sound set lacks
	label: Record<LabelLanguage, string>,
	flag: string,
	// when true, only shown in development / beta builds, hidden in production
	beta?: boolean,
}

// the country's name in an interface language: from `name` where the interface
// language is also a sound language, from `label` otherwise
export function uiName(c: Country, uiLanguage: string): string {
	if (uiLanguage in c.name) return c.name[uiLanguage as Language]
	if (uiLanguage in c.label) return c.label[uiLanguage as LabelLanguage]
	return c.name.en
}
