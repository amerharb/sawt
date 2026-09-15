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
		// Bjørnson's first stanza. Custom sings the first and the last two, the
		// first by a long way the most often, and it is the one the choir
		// editions print above all the others
		lyrics: ['no'],
		/*
		 * No intro. The recording has a clear gap at 11 s, and it is the first of
		 * six — 11.0, 22.8, 29.3, 34.6, 41.9, 47.0 — spread right through the
		 * piece at five to twelve seconds apart. They are the seams between
		 * strains, not a fanfare in front of the tune, which is exactly the trap
		 * `silencedetect` sets and several countries here have fallen into.
		 *
		 * No `score` either, for the same reason as Portugal's: there is nothing
		 * legible to transcribe. No Wikipedia edition in seventy-two carries
		 * notation, and Commons has one file that looks like a score and is in
		 * fact the Norwegian coat of arms with a four-part choir setting printed
		 * behind it, most of it hidden under the shield. 🎼 offers the countries
		 * it has notes for, and this is not one.
		 */
		// Nordraak set it over the winter of 1863–64 and it was first sung in
		// public on 17 May 1864; Norway had no *official* anthem at all until the
		// Storting named this one, a hundred and fifty-five years later
		composed: '1864',
		adopted: '2019-12-11',
	},
}
