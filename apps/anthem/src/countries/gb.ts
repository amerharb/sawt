import { Country } from './Country'

export const gb: Country = {
	code: 'gb',
	name: {
		en: 'United Kingdom',
		ar: 'المملكة المتحدة',
		de: 'Vereinigtes Königreich',
		el: 'Ηνωμένο Βασίλειο',
		sv: 'Storbritannien',
		th: 'สหราชอาณาจักร',
		tr: 'Birleşik Krallık',
		zh: '英国',
	},
	flag: '🇬🇧',
	nativeLanguage: 'en',
	anthem: {
		nativeName: 'God Save the King',
		name: {
			en: 'God Save the King',
		},
	},
	// added in bulk from the Flags project: the recording is in place, but the
	// intro point and the 🎼 melody still need doing
	beta: true,
}
