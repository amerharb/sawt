/*
 * "Which animal am I?" — as a setting rather than a question asked at the door.
 *
 * It lives in `@sawt/game` and keeps its own preference, which is a deliberate
 * departure from the way every other setting in these apps works: those belong
 * to one app and travel through its own `Settings` blob. This one belongs to
 * the courtyard, which is shared code, and threading an identical field
 * through seven settings stores would be seven copies of one idea. An app
 * drops in `<AvatarSetting t={t}/>` and is done.
 *
 * Nothing here needs a server, on purpose: a settings panel has to open with
 * no room, no socket and possibly no network.
 */
import { useState } from 'react'

import { AVATARS, preferredAvatar, setPreferredAvatar } from './avatar'

type Translate = (key: string) => string

export function AvatarSetting({ t }: Readonly<{ t: Translate }>) {
	const [chosen, setChosen] = useState(preferredAvatar)

	const choose = (i: number) => {
		setPreferredAvatar(i)
		setChosen(i)
	}

	return (
		<div className="settings-row">
			<div className="settings-uilang">
				<span className="settings-uilang-icon" aria-hidden="true">🏟️</span>
				<span>{t('settings.avatar')}</span>
			</div>
			{/*
			  * The same grid the courtyard's own picker uses, so an animal is the
			  * same size and in the same place in both — a child choosing here and
			  * a child choosing at a full room's door are doing one thing.
			  */}
			<div className="race-avatars" role="radiogroup" aria-label={t('settings.avatar')}>
				{AVATARS.map((emoji, i) => (
					<button
						key={`mine-${emoji}`}
						className={i === chosen ? 'chosen' : undefined}
						role="radio"
						aria-checked={i === chosen}
						aria-label={emoji}
						onClick={() => choose(i)}
					>
						{emoji}
					</button>
				))}
			</div>
		</div>
	)
}
