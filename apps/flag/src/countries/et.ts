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
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇪🇹',
}
