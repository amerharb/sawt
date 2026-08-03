import { Country } from './Country'

export const nl: Country = {
	code: 'nl',
	name: {
		en: 'Netherlands',
		ar: 'هولندا',
		de: 'Niederlande',
		el: 'Ολλανδία',
		sv: 'Nederländerna',
		th: 'เนเธอร์แลนด์',
		tr: 'Hollanda',
		zh: '荷兰',
	},
	flag: '🇳🇱',
	nativeLanguage: 'nl',
	anthem: {
		nativeName: 'Het Wilhelmus',
		name: {
			en: 'The William',
		},
	},
	// added in bulk from the Flags project: the recording is in place, but the
	// intro point and the 🎼 melody still need doing
	beta: true,
}
