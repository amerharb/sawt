import { Country } from './Country'

export const no: Country = {
	code: 'no',
	name: {
		en: 'Norway',
		ar: 'النرويج',
		de: 'Norwegen',
		el: 'Νορβηγία',
		sv: 'Norge',
		th: 'นอร์เวย์',
		tr: 'Norveç',
		zh: '挪威',
	},
	flag: '🇳🇴',
	nativeLanguage: 'no',
	anthem: {
		nativeName: 'Ja, vi elsker dette landet',
		name: {
			en: 'Yes, We Love This Country',
		},
	},
	// added in bulk from the Flags project: the recording is in place, but the
	// intro point and the 🎼 melody still need doing
	beta: true,
}
