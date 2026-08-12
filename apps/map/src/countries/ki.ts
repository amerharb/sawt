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
}
