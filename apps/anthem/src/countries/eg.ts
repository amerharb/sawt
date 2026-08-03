import { Country } from './Country'

export const eg: Country = {
	code: 'eg',
	name: {
		en: 'Egypt',
		ar: 'مصر',
		de: 'Ägypten',
		el: 'Αίγυπτος',
		sv: 'Egypten',
		th: 'อียิปต์',
		tr: 'Mısır',
		zh: '埃及',
	},
	flag: '🇪🇬',
	nativeLanguage: 'ar',
	anthem: {
		nativeName: 'بلادي بلادي بلادي',
		name: {
			en: 'My Homeland, My Homeland, My Homeland',
		},
	},
	// added in bulk from the Flags project: the recording is in place, but the
	// intro point and the 🎼 melody still need doing
	beta: true,
}
