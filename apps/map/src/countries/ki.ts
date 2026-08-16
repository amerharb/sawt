import { Country } from './Country'

export const ki: Country = {
	code: 'ki',
	name: {
		en: 'Kiribati',
		ar: 'كيريباتي',
		de: 'Kiribati',
		sv: 'Kiribati',
		da: 'Kiribati',
		sq: 'Kiribati',
		pt: 'Kiribati',
		tr: 'Kiribati',
		fa: 'کیریباتی',
		uk: 'Кірибаті',
		// display-only — these three interface languages have no recordings
		el: 'Κιριμπάτι',
		th: 'คิริบาส',
		zh: '基里巴斯',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇰🇮',
	// beta on the map only: Kiribati is 19 separate islands and the biggest of
	// them is a sub-pixel sliver, so there is nothing to see or click. Too
	// spread out for one dot, unlike the micro-states in the MARKERS table.
	// It stays live in Flag, where a card is a card.
	beta: true,
}
