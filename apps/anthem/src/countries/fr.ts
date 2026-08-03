import { Country } from './Country'

export const fr: Country = {
	code: 'fr',
	name: {
		en: 'France',
		ar: 'فرنسا',
		de: 'Frankreich',
		el: 'Γαλλία',
		sv: 'Frankrike',
		th: 'ฝรั่งเศส',
		tr: 'Fransa',
		zh: '法国',
	},
	flag: '🇫🇷',
	nativeLanguage: 'fr',
	anthem: {
		nativeName: 'La Marseillaise',
		name: {
			en: 'The Marseillaise',
		},
	},
	// added in bulk from the Flags project: the recording is in place, but the
	// intro point and the 🎼 melody still need doing
	beta: true,
}
