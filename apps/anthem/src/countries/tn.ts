import { Country } from './Country'

export const tn: Country = {
	code: 'tn',
	name: {
		en: 'Tunisia',
		ar: 'تونس',
		de: 'Tunesien',
		el: 'Τυνησία',
		sv: 'Tunisien',
		th: 'ตูนิเซีย',
		tr: 'Tunus',
		zh: '突尼斯',
	},
	flag: '🇹🇳',
	nativeLanguage: 'ar',
	anthem: {
		nativeName: 'حماة الحمى',
		name: {
			en: 'Defenders of the Homeland',
		},
	},
	// added in bulk from the Flags project: the recording is in place, but the
	// intro point and the 🎼 melody still need doing
	beta: true,
}
