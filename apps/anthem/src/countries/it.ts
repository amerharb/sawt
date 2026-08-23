import { Country } from './Country'

export const it: Country = {
	code: 'it',
	name: {
		en: 'Italy',
		ar: 'إيطاليا',
		de: 'Italien',
		el: 'Ιταλία',
		sv: 'Italien',
		th: 'อิตาลี',
		tr: 'İtalya',
		zh: '意大利',
	},
	flag: '🇮🇹',
	nativeLanguage: 'it',
	anthem: {
		nativeName: 'Il Canto degli Italiani',
		name: {
			en: 'The Song of the Italians',
		},
		intro: 24.5,
	},
	// added in bulk from the Flags project: the recording is in place, but the
	// intro point and the 🎼 melody still need doing
}
