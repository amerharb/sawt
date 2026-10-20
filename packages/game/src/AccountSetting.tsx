import { useState } from 'react'
import type { Baab } from './useBaab'
import { SignInIcon, ProfileIcon, SignOutIcon } from './AccountIcons'

type Translate = (key: string) => string

/*
 * ⚙️'s 👤: who is signed in, in a line, and the button that changes it. The
 * sign-in itself — the email, the code, the nickname — happens in BaabSheet,
 * which `onOpen` opens; this block only says where things stand and offers the
 * way out without a detour through the sheet.
 *
 * The session is the family's, not the app's: the cookie is set for the whole
 * of sawt.info, so a child signed in on the landing page arrives here signed
 * in, and signing out here signs out everywhere. Nothing about it is stored by
 * the app — `baab` asks baab on every page load and on every return to the
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
						<SignInIcon/>
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
					<ProfileIcon/>
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
					<SignOutIcon/>
				</button>
			</div>
		</div>
	)
}
