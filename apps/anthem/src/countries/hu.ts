import { Country } from './Country'

export const hu: Country = {
	code: 'hu',
	name: {
		en: 'Hungary',
		ar: 'المجر',
		de: 'Ungarn',
		el: 'Ουγγαρία',
		sv: 'Ungern',
		th: 'ฮังการี',
		tr: 'Macaristan',
		zh: '匈牙利',
	},
	flag: '🇭🇺',
	nativeLanguage: 'hu',
	anthem: {
		nativeName: 'Himnusz',
		name: {
			en: 'Hymn',
		},
	},
	// added in bulk from the Flags project: the recording is in place, but the
	// intro point and the 🎼 melody still need doing
	beta: true,
}
