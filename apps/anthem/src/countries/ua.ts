import { Country } from './Country'

export const ua: Country = {
	code: 'ua',
	name: {
		en: 'Ukraine',
		ar: 'أوكرانيا',
		de: 'Ukraine',
		el: 'Ουκρανία',
		sv: 'Ukraina',
		th: 'ยูเครน',
		tr: 'Ukrayna',
		zh: '乌克兰',
	},
	flag: '🇺🇦',
	nativeLanguage: 'uk',
	anthem: {
		nativeName: 'Ще не вмерла України і слава, і воля',
		name: {
			en: 'Ukraine\'s Glory Has Not Yet Perished',
		},
	},
	// added in bulk from the Flags project: the recording is in place, but the
	// intro point and the 🎼 melody still need doing
	beta: true,
}
