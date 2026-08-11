import { Country } from './Country'

export const us: Country = {
	code: 'us',
	name: {
		en: 'United States of America',
		ar: 'الولايات المتحدة الأمريكية',
		de: 'Vereinigte Staaten von Amerika',
		sv: 'Amerikas förenta stater',
		da: 'Amerikas Forenede Stater',
		sq: 'Shtetet e Bashkuara të Amerikës',
		pt: 'Estados Unidos da América',
		tr: 'Amerika Birleşik Devletleri',
		fa: 'ایالات متحده آمریکا',
		uk: 'Сполучені Штати Америки',
	},
	// the three interface languages the sound set lacks — hover names only.
	label: {
		el: 'Ηνωμένες Πολιτείες Αμερικής',
		th: 'สหรัฐอเมริกา',
		zh: '美国',
	},
	flag: '🇺🇸',
}
