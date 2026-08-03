import { Country } from './Country'

export const ps: Country = {
	code: 'ps',
	name: {
		en: 'Palestine',
		ar: 'فلسطين',
		de: 'Palästina',
		el: 'Παλαιστίνη',
		sv: 'Palestina',
		th: 'ปาเลสไตน์',
		tr: 'Filistin',
		zh: '巴勒斯坦',
	},
	flag: '🇵🇸',
	nativeLanguage: 'ar',
	anthem: {
		nativeName: 'فدائي',
		name: {
			en: 'Warrior',
		},
	},
	// added in bulk from the Flags project: the recording is in place, but the
	// intro point and the 🎼 melody still need doing
	beta: true,
}
