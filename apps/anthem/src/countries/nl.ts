import { Country } from './Country'

export const nl: Country = {
	code: 'nl',
	name: {
		en: 'Netherlands',
		ar: 'هولندا',
		de: 'Niederlande',
		el: 'Ολλανδία',
		sv: 'Nederländerna',
		th: 'เนเธอร์แลนด์',
		tr: 'Hollanda',
		zh: '荷兰',
	},
	flag: '🇳🇱',
	nativeLanguage: 'nl',
	anthem: {
		nativeName: 'Het Wilhelmus',
		name: {
			en: 'The William',
		},
		// the first stanza; custom sometimes adds the sixth, the app carries one
		lyrics: ['nl'],
		// no intro: the band is into the tune at 0.5 s. The recording's three
		// internal gaps — 14.1, 27.8, 44.0 s — are the seams between the four
		// phrases of the stanza, and their lengths match the beat counts below
		// phrase for phrase (14 · 14 · 16 · 16), so none of them is a fanfare
		instrument: {
			hash: 'd5f4e34a04b9',
			intro: 0,
		},
		score: {
			// F major, 60 beats. From the three LilyPond fragments on
			// nl.wikipedia — text notation, no arranger's voices to see through —
			// which give the tune in G as A A B C: the first phrase sung twice,
			// then two more. The recording is in F, measured from fundamentals
			// (F and C far ahead of D, B♭, A), so the score is two semitones
			// down. Tempo from the recording's own phrase lengths: 62, 63, 62
			// and then 52 for the final phrase, which the band stretches; 60 is
			// the pace of the tune before that ritardando
			tempo: 60,
			key: 'F major',
			hash: 'a5c7a06151d4',
		},
		// the tune is a 1568 contrafactum of a French soldiers' song; Valerius's
		// 1626 setting made it the hymn it is now
		composed: '1568',
		adopted: '1932-05-10',
	},
}
