import { Country } from './Country'

export const cz: Country = {
	code: 'cz',
	name: {
		en: 'Czech Republic',
		ar: 'التشيك',
		de: 'Tschechien',
		el: 'Τσεχία',
		sv: 'Tjeckien',
		th: 'เช็กเกีย',
		tr: 'Çekya',
		zh: '捷克',
	},
	flag: '🇨🇿',
	nativeLanguage: 'cs',
	anthem: {
		nativeName: 'Kde domov můj',
		name: {
			en: 'Where Is My Home?',
		},
	},
	// added in bulk from the Flags project: the recording is in place, but the
	// intro point and the 🎼 melody still need doing
	beta: true,
}
