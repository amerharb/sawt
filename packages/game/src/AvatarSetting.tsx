import { useEffect, useRef, useState } from 'react'

import { AVATARS, preferredAvatar, setPreferredAvatar } from './avatar'

type Translate = (key: string) => string

/*
 * ⚙️'s "my animal": which of the palette this child would like to be in a
 * courtyard. Stored by index, the way saha names them, and read by useRace
 * when a room is opened or joined; the room's own picker still takes over
 * when the animal is already worn there.
 *
 * A dropdown the page draws, not a <select>. A native <select> shows the
 * chosen animal in our font on its closed control, but the open list is
 * drawn by the platform on Safari, on iOS and Android, and on Chrome for the
 * Mac — so the twelve animals came out in the OS's own emoji set exactly
 * where a child is choosing between them. Drawing the list ourselves is the
 * only way a fox is the same fox in the list, on the control and on the
 * score chip.
 */
export function AvatarSetting({ t }: Readonly<{ t: Translate }>) {
	const [chosen, setChosen] = useState(preferredAvatar)
	const [open, setOpen] = useState(false)
	const wrap = useRef<HTMLDivElement>(null)

	const choose = (i: number) => {
		setPreferredAvatar(i)
		setChosen(i)
		setOpen(false)
	}

	// a tap anywhere else, or Escape, closes the list — as a native one would
	useEffect(() => {
		if (!open) return
		const away = (e: PointerEvent) => {
			if (!wrap.current?.contains(e.target as Node)) setOpen(false)
		}
		const key = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setOpen(false)
		}
		document.addEventListener('pointerdown', away)
		document.addEventListener('keydown', key)
		return () => {
			document.removeEventListener('pointerdown', away)
			document.removeEventListener('keydown', key)
		}
	}, [open])

	// arrows walk the open list; Enter and Space are the buttons' own
	const walk = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
		if (step === undefined) return
		e.preventDefault()
		const options = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('button'))
		const at = options.indexOf(document.activeElement as HTMLButtonElement)
		const next = at === -1 ? chosen : (at + step + options.length) % options.length
		options[next]?.focus()
	}

	return (
		<div className="settings-row">
			<div className="settings-uilang">
				<span className="settings-uilang-icon" aria-hidden="true">🏟️</span>
				<div className="settings-avatar" ref={wrap}>
					<button
						type="button"
						className="language-select settings-avatar-current"
						aria-haspopup="listbox"
						aria-expanded={open}
						aria-label={t('settings.avatar')}
						title={t('settings.avatar')}
						onClick={() => setOpen(o => !o)}
					>
						<span className="avatar-glyph">{AVATARS[chosen]}</span>
						<span className="settings-avatar-caret" aria-hidden="true">▾</span>
					</button>
					{open && (
						<div
							className="settings-avatar-list"
							role="listbox"
							aria-label={t('settings.avatar')}
							onKeyDown={walk}
						>
							{AVATARS.map((emoji, i) => (
								<button
									key={`mine-${emoji}`}
									type="button"
									role="option"
									aria-selected={i === chosen}
									aria-label={emoji}
									className="avatar-glyph"
									autoFocus={i === chosen}
									onClick={() => choose(i)}
								>
									{emoji}
								</button>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
