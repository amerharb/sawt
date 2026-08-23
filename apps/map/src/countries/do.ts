import { Country } from './Country'

// `do` is a reserved word, so the export is `dom` — the same dodge in/gb-sct use
export const dom: Country = {
	code: 'do',
	name: {
		en: 'Dominican Republic',
		ar: 'جمهورية الدومينيكان',
		de: 'Dominikanische Republik',
		sv: 'Dominikanska republiken',
		da: 'Den Dominikanske Republik',
		sq: 'Republika Dominikane',
		pt: 'República Dominicana',
		tr: 'Dominik Cumhuriyeti',
		fa: 'جمهوری دومینیکن',
		uk: 'Домініканська Республіка',
		// display-only — these three interface languages have no recordings
		el: 'Δομινικανή Δημοκρατία',
		th: 'สาธารณรัฐโดมินิกัน',
		zh: '多米尼加共和国',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇩🇴',
}
