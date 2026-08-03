import { Country } from './Country'

export const de: Country = {
	code: 'de',
	name: {
		en: 'Germany',
		ar: 'ألمانيا',
		de: 'Deutschland',
		el: 'Γερμανία',
		sv: 'Tyskland',
		th: 'เยอรมนี',
		tr: 'Almanya',
		zh: '德国',
	},
	flag: '🇩🇪',
	nativeLanguage: 'de',
	anthem: {
		nativeName: 'Das Lied der Deutschen',
		name: {
			en: 'The Song of the Germans',
		},
		// Hoffmann von Fallersleben died in 1874, so the words are public domain
		lyrics: ['de'],
	},
	// added in bulk from the Flags project: the recording is in place, but the
	// intro point and the 🎼 melody still need doing
	beta: true,
}
