import { Verb } from './Verb'

export const eat: Verb = {
	code: 'eat',
	emoji: '🍽️',
	name: {
		en: { do: 'Eat!', doing: 'Eating', did: 'Ate', done: 'Has eaten' },
		ar: { do: 'كُلْ', doing: 'يأكل', done: 'أكل' },
		de: { do: 'Iss!', doing: 'Isst', did: 'Aß', done: 'Hat gegessen' },
		sv: { do: 'Ät!', doing: 'Äter', did: 'Åt', done: 'Har ätit' },
	},
}
