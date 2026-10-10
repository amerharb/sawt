import { Country } from './Country'

export const th: Country = {
	code: 'th',
	name: {
		en: 'Thailand',
		ar: 'تايلاند',
		de: 'Thailand',
		el: 'Ταϊλάνδη',
		sv: 'Thailand',
		th: 'ประเทศไทย',
		tr: 'Tayland',
		zh: '泰国',
	},
	flag: '🇹🇭',
	nativeLanguage: 'th',
	anthem: {
		nativeName: 'เพลงชาติไทย',
		name: {
			en: 'Thai National Anthem',
			ar: 'النشيد الوطني التايلاندي',
		},
		instrument: {
			hash: '00478449137e',
			intro: 0,
		},
		score: {
			// C major; melody from the MIDI's MELODY track (Software Toolworks World
			// Atlas, 1991 — Thailand's anthem is unchanged since 1939)
			tempo: 120,
			key: 'C major',
			hash: '57b576fcf128',
		},
		composed: '1932',
		adopted: '1939-12-10',
	},
}
