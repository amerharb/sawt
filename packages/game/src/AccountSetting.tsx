import { useState } from 'react'
import type { Baab } from './useBaab'

type Translate = (key: string) => string

/*
 * The way in and the way out: an arrow going into an open box, and one coming
 * out of it, and the profile as a person in a circle. Tabler's outline
 * `login`, `logout` and `user-circle`, MIT licensed
 * (© 2020-2024 Paweł Kuna, tabler.io/icons), drawn in the button's own colour
 * so they follow the theme. Sized by the button's font size.
 */
const icon = (paths: string[]) => (
	<svg
		className="account-glyph"
		viewBox="0 0 24 24"
		width="1em"
		height="1em"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
		focusable="false"
	>
		{paths.map(d => <path key={d} d={d}/>)}
	</svg>
)

const SIGN_IN = icon([
	'M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2',
	'M21 12h-13l3 -3',
	'M11 15l-3 -3',
])

// the profile behind the door — today the nickname — opened in the sheet
const PROFILE = icon([
	'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0',
	'M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
	'M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855',
])

const SIGN_OUT = icon([
	'M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2',
	'M9 12h12l-3 -3',
	'M18 15l3 -3',
])

/*
 * ⚙️'s 👤: who is signed in, in a line, and the button that changes it. The
 * sign-in itself — the email, the code, the nickname — happens in BaabSheet,
 * which `onOpen` opens; this block only says where things stand and offers the
 * way out without a detour through the sheet.
 *
 * The session is the family's, not the app's: the cookie is set for the whole
 * of sawt.info, so a child signed in on the landing page arrives here signed
 * in, and signing out here signs out everywhere. Nothing about it is stored by
 * the app — `baab` asks the door on every page load and on every return to the
 * tab.
 *
 * Three states, as the sheet has: a moment of asking, signed out, signed in.
 * Shared the way AvatarSetting is — the app hands in its translator and styles
 * the `account-*` class names in its own index.css.
 */
export function AccountSetting({ t, baab, onOpen }: Readonly<{
	t: Translate,
	baab: Baab,
	// opens the sign-in sheet; the caller closes ⚙️ first, as 💬 does
	onOpen: () => void,
}>) {
	const { session } = baab
	const [leaving, setLeaving] = useState(false)

	if (session.state === 'unknown') {
		return (
			<div className="account">
				<p className="account-lead">{t('baab.asking')}</p>
			</div>
		)
	}

	if (session.state === 'out') {
		return (
			<div className="account">
				<p className="account-lead">{t('baab.lead')}</p>
				<div className="account-actions">
					{/* the way in as an icon, its words in the tooltip */}
					<button
						type="button"
						className="account-button account-icon"
						aria-label={t('baab.open')}
						title={t('baab.open')}
						onClick={onOpen}
					>
						{SIGN_IN}
					</button>
				</div>
			</div>
		)
	}

	const { handle, nickname } = session.profile
	return (
		<div className="account">
			<p className="account-who">
				<span className="account-label">{t('baab.signedInAs')}</span>
				{/* the nickname when there is one, and the handle always — it is
				    the name the apps know a player by */}
				{nickname && <span className="account-name">{nickname}</span>}
				<span className="account-handle" translate="no">{handle}</span>
			</p>
			<div className="account-actions">
				{/* the sheet holds the whole profile — the handle, the nickname —
				    so the way to it is the profile's own icon, not one field's name */}
				<button
					type="button"
					className="account-button account-icon"
					aria-label={t('baab.profile')}
					title={t('baab.profile')}
					onClick={onOpen}
				>
					{PROFILE}
				</button>
				{/* the way out as an icon, its words in the tooltip, as the way in's are */}
				<button
					type="button"
					className="account-button account-icon"
					aria-label={t('baab.leave')}
					title={t('baab.leave')}
					disabled={leaving}
					onClick={async () => {
						setLeaving(true)
						try {
							await baab.leave()
						} finally {
							setLeaving(false)
						}
					}}
				>
					{SIGN_OUT}
				</button>
			</div>
		</div>
	)
}
