import { Verb } from './Verb'

export const raisehand: Verb = {
	code: 'raisehand',
	emoji: '🙋',
	name: {
		en: { do: 'Raise your hand!', doing: 'Raising the hand', did: 'Raised the hand', done: 'Has raised the hand' },
		ar: { do: 'اِرْفَعْ يَدَك', doing: 'يرفع يده', done: 'رفع يده' },
		// sich melden — the German classroom word; Perfekt is "hat sich gemeldet"
		de: { do: 'Melde dich!', doing: 'Meldet sich', did: 'Meldete sich', done: 'Hat sich gemeldet' },
		sv: { do: 'Räck upp handen!', doing: 'Räcker upp handen', did: 'Räckte upp handen', done: 'Har räckt upp handen' },
	},
}
