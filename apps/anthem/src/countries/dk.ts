import { Country } from './Country'

export const dk: Country = {
	code: 'dk',
	name: {
		en: 'Denmark',
		ar: 'الدنمارك',
		de: 'Dänemark',
		el: 'Δανία',
		sv: 'Danmark',
		th: 'เดนมาร์ก',
		tr: 'Danimarka',
		zh: '丹麦',
	},
	flag: '🇩🇰',
	nativeLanguage: 'da',
	anthem: {
		nativeName: 'Der er et yndigt land',
		name: {
			en: 'There Is a Lovely Country',
		},
	},
	// added in bulk from the Flags project: the recording is in place, but the
	// intro point and the 🎼 melody still need doing
	beta: true,
}
