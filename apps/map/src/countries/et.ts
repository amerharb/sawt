import { Country } from './Country'

export const et: Country = {
	code: 'et',
	name: {
		en: 'Ethiopia',
		ar: 'إثيوبيا',
		de: 'Äthiopien',
		sv: 'Etiopien',
		da: 'Etiopien',
		sq: 'Etiopia',
		pt: 'Etiópia',
		tr: 'Etiyopya',
		fa: 'اتیوپی',
		uk: 'Ефіопія',
		// display-only — these three interface languages have no recordings
		el: 'Αιθιοπία',
		th: 'เอธิโอเปีย',
		zh: '埃塞俄比亚',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇪🇹',
}
