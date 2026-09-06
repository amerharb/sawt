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
 * A dropdown rather than a grid of twelve, because a settings panel is a
 * column of rows and this is one row's worth of question — the same shape the
 * interface-language row already has, icon and control side by side. The grid
 * still exists where it earns the space: at a full room's door, where a child
 * has to see which animals are already taken.
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
			<label className="settings-uilang">
				<span className="settings-uilang-icon" aria-hidden="true">🏟️</span>
				<select
					className="language-select"
					aria-label={t('settings.avatar')}
					title={t('settings.avatar')}
					value={chosen}
					onChange={e => choose(Number(e.target.value))}
				>
					{AVATARS.map((emoji, i) => (
						<option key={`mine-${emoji}`} value={i}>{emoji}</option>
					))}
				</select>
			</label>
		</div>
	)
}
