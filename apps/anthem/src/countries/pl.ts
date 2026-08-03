import { Country } from './Country'

export const pl: Country = {
	code: 'pl',
	name: {
		en: 'Poland',
		ar: 'بولندا',
		de: 'Polen',
		el: 'Πολωνία',
		sv: 'Polen',
		th: 'โปแลนด์',
		tr: 'Polonya',
		zh: '波兰',
	},
	flag: '🇵🇱',
	nativeLanguage: 'pl',
	anthem: {
		nativeName: 'Mazurek Dąbrowskiego',
		name: {
			en: 'Dąbrowski\'s Mazurka',
		},
	},
	// added in bulk from the Flags project: the recording is in place, but the
	// intro point and the 🎼 melody still need doing
	beta: true,
}
