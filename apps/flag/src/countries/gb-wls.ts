import { Country } from './Country'

export const gbWls: Country = {
	code: 'gb-wls',
	name: {
		en: 'Wales',
		ar: 'ويلز',
		de: 'Wales',
		sv: 'Wales',
		da: 'Wales',
		sq: 'Uellsi',
		pt: 'País de Gales',
		tr: 'Galler',
		fa: 'ولز',
		uk: 'Уельс',
	},
	// recorded in English, German, Swedish and Arabic only so far — in any
	// other hearing language this country steps aside instead of clicking
	// silently
	sounds: ['en', 'de', 'sv', 'ar'],
	// a country of the United Kingdom, not a sovereign state: its flag is the
	// subdivision emoji (a tag sequence), not a regional-indicator pair
	flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
}
