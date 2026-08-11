import { Country } from './Country'

export const ar: Country = {
	code: 'ar',
	name: {
		en: 'Argentina',
		ar: 'الأرجنتين',
		de: 'Argentinien',
		sv: 'Argentina',
		da: 'Argentina',
		sq: 'Argjentina',
		pt: 'Argentina',
		tr: 'Arjantin',
		fa: 'آرژانتین',
		uk: 'Аргентина',
		// display-only — these three interface languages have no recordings
		el: 'Αργεντινή',
		th: 'อาร์เจนตินา',
		zh: '阿根廷',
	},
	// recorded in English only so far — in any other hearing language this
	// country steps aside instead of clicking silently
	sounds: ['en'],
	flag: '🇦🇷',
}
