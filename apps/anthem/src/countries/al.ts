import { Country } from './Country'

export const al: Country = {
	code: 'al',
	name: {
		en: 'Albania',
		ar: 'ألبانيا',
		de: 'Albanien',
		el: 'Αλβανία',
		sv: 'Albanien',
		th: 'แอลเบเนีย',
		tr: 'Arnavutluk',
		zh: '阿尔巴尼亚',
	},
	flag: '🇦🇱',
	nativeLanguage: 'sq',
	anthem: {
		nativeName: 'Himni i Flamurit',
		name: {
			en: 'Hymn to the Flag',
		},
		// no intro: the recording is three straight statements of the tune, with
		// seams at 10.7 / 21.1 / 41.7 s — verse structure, not a fanfare
		composed: '1880',
		adopted: '1912-11-28',
	},
}
