import { Verb } from './Verb'

export const swim: Verb = {
	code: 'swim',
	emoji: '🏊',
	name: {
		en: { do: 'Swim!', doing: 'Swimming', did: 'Swam', done: 'Has swum' },
		ar: { do: 'اِسْبَحْ', doing: 'يسبح', done: 'سبح' },
		// schwimmen takes sein: ist geschwommen, not hat
		de: { do: 'Schwimm!', doing: 'Schwimmt', did: 'Schwamm', done: 'Ist geschwommen' },
		sv: { do: 'Simma!', doing: 'Simmar', did: 'Simmade', done: 'Har simmat' },
	},
}
