import { Country } from './Country'

export const st: Country = {
	code: 'st',
	name: {
		en: 'São Tomé and Príncipe',
		ar: 'ساو تومي وبرينسيبي',
		de: 'São Tomé und Príncipe',
		sv: 'São Tomé och Príncipe',
		da: 'São Tomé og Príncipe',
		sq: 'São Tomé dhe Príncipe',
		pt: 'São Tomé e Príncipe',
		tr: 'São Tomé ve Príncipe',
		fa: 'سائوتومه و پرینسیپ',
		uk: 'Сан-Томе і Принсіпі',
		// display-only — these three interface languages have no recordings
		el: 'Σάο Τομέ και Πρίνσιπε',
		th: 'เซาตูเมและปรินซีปี',
		zh: '圣多美和普林西比',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇸🇹',
	// beta on the map only: São Tomé and Príncipe is 2 islands, the biggest 0.6 x 0.9 units —
	// smaller than Luxembourg, the smallest shape that still reads as a
	// country, so there is nothing to click. Stays live in Flag.
	beta: true,
}
