import { Country } from './Country'

export const ag: Country = {
	code: 'ag',
	name: {
		en: 'Antigua and Barbuda',
		ar: 'أنتيغوا وبربودا',
		de: 'Antigua und Barbuda',
		sv: 'Antigua och Barbuda',
		da: 'Antigua og Barbuda',
		sq: 'Antigua dhe Barbuda',
		pt: 'Antígua e Barbuda',
		tr: 'Antigua ve Barbuda',
		fa: 'آنتیگوا و باربودا',
		uk: 'Антигуа і Барбуда',
		// display-only — these three interface languages have no recordings
		el: 'Αντίγκουα και Μπαρμπούντα',
		th: 'แอนติกาและบาร์บูดา',
		zh: '安提瓜和巴布达',
	},
	// recorded in English and German only so far — in any other hearing
	// language this country steps aside instead of clicking silently
	sounds: ['en', 'de'],
	flag: '🇦🇬',
}
