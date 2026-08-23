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
	},
	// recorded in English, German and Swedish only so far — in any other
	// hearing language this country steps aside instead of clicking silently
	sounds: ['en', 'de', 'sv'],
	flag: '🇸🇹',
}
