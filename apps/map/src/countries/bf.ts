import { Country } from './Country'

export const bf: Country = {
	code: 'bf',
	name: {
		en: 'Burkina Faso',
		ar: 'بوركينا فاسو',
		de: 'Burkina Faso',
		sv: 'Burkina Faso',
		da: 'Burkina Faso',
		sq: 'Burkina Faso',
		pt: 'Burkina Faso',
		tr: 'Burkina Faso',
		fa: 'بورکینافاسو',
		uk: 'Буркіна-Фасо',
		// display-only — these three interface languages have no recordings
		el: 'Μπουρκίνα Φάσο',
		th: 'บูร์กินาฟาโซ',
		zh: '布基纳法索',
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇧🇫',
}
