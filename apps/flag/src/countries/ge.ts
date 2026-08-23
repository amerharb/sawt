import { Country } from './Country'

export const ge: Country = {
	code: 'ge',
	name: {
		en: 'Georgia',
		ar: 'جورجيا',
		de: 'Georgien',
		sv: 'Georgien',
		da: 'Georgien',
		sq: 'Gjeorgjia',
		pt: 'Geórgia',
		tr: 'Gürcistan',
		fa: 'گرجستان',
		uk: 'Грузія',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	flag: '🇬🇪',
}
