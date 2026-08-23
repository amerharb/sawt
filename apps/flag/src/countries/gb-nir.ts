import { Country } from './Country'

export const gbNir: Country = {
	code: 'gb-nir',
	name: {
		en: 'Northern Ireland',
		ar: 'أيرلندا الشمالية',
		de: 'Nordirland',
		sv: 'Nordirland',
		da: 'Nordirland',
		sq: 'Irlanda e Veriut',
		pt: 'Irlanda do Norte',
		tr: 'Kuzey İrlanda',
		fa: 'ایرلند شمالی',
		uk: 'Північна Ірландія',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	// a country of the United Kingdom, not a sovereign state: its flag is the
	// subdivision emoji (a tag sequence), not a regional-indicator pair —
	// there is no RGI emoji for it, so the glyph is this project's own,
	// hand-added to flags.woff2
	flag: '🏴󠁧󠁢󠁮󠁩󠁲󠁿',
}
