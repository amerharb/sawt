import { Country } from './Country'

export const ir: Country = {
	code: 'ir',
	name: {
		en: 'Iran',
		ar: 'إيران',
		de: 'Iran',
		el: 'Ιράν',
		sv: 'Iran',
		th: 'อิหร่าน',
		tr: 'İran',
		zh: '伊朗',
	},
	flag: '🇮🇷',
	nativeLanguage: 'fa',
	anthem: {
		nativeName: 'سرود ملی جمهوری اسلامی ایران',
		name: {
			en: 'National Anthem of the Islamic Republic of Iran',
		},
	},
	// added in bulk from the Flags project: the recording is in place, but the
	// intro point and the 🎼 melody still need doing
	beta: true,
}
