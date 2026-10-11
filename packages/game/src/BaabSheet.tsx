/*
 * The sign-in sheet: baab, as a page shows it. Three views, one at a
 * time, chosen by what the session is — an email field when nobody is in, a
 * code field once a code has gone out, and the account itself behind it: the
 * handle on its plate, the nickname, and the way out.
 *
 * It says out loud what the rules ask a sign-in to say: that signing in keeps
 * you signed in on this device for 180 days. The rest is baab's own
 * promise, repeated — only a keyed hash of the address is ever kept.
 *
 * Its own view, not a panel: it closes on ✕, Escape, or a click anywhere
 * else, the way the feedback and courtyard sheets do. Shared by every app
 * the way those are — the app hands in its translator and its reading
 * direction, and styles the class names in its own index.css.
 */
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Baab } from './useBaab'
import type { Entry, Profile } from './baab'

type Translate = (key: string) => string

type Props = {
	t: Translate,
	// which way the interface language reads; the whole sheet follows it
	dir: 'ltr' | 'rtl',
	baab: Baab,
	onClose: () => void,
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CODE = /^\d{6}$/

// what arriving by link has to say, if anything
const ARRIVAL_NOTE: Record<Entry, string | null> = {
	in: 'baab.arrived',
	wrong: 'baab.linkWrong',
	down: 'baab.down',
}

export function BaabSheet({ t, dir, baab, onClose }: Readonly<Props>) {
	const { session, pending, arrival } = baab
	const [email, setEmail] = useState('')
	const [code, setCode] = useState('')
	const [busy, setBusy] = useState(false)
	// a key into the dictionary, so it reads in whatever language is on
	const [note, setNote] = useState<string | null>(arrival ? ARRIVAL_NOTE[arrival] : null)
	const sheetRef = useRef<HTMLDivElement | null>(null)

	// ✕, Escape, or a click anywhere outside the sheet
	useEffect(() => {
		const onMouse = (e: MouseEvent) => {
			if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) onClose()
		}
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		document.addEventListener('mousedown', onMouse)
		document.addEventListener('keydown', onKey)
		return () => {
			document.removeEventListener('mousedown', onMouse)
			document.removeEventListener('keydown', onKey)
		}
	}, [onClose])

	// one call at a time; the outcome becomes the note, or clears it
	const run = async <T extends string>(call: () => Promise<T>, notes: Partial<Record<T, string>>) => {
		setBusy(true)
		try {
			const outcome = await call()
			setNote(notes[outcome] ?? null)
			return outcome
		} finally {
			setBusy(false)
		}
	}

	const knock = (address: string) =>
		run(() => baab.knock(address), { wait: 'baab.wait', refused: 'baab.refused', down: 'baab.down' })

	const enter = () =>
		run(() => baab.enter(code), { wrong: 'baab.wrong', down: 'baab.down' })

	const emailOk = email.trim() === '' || EMAIL.test(email.trim())
	const canKnock = EMAIL.test(email.trim()) && !busy

	const alert = note && <p className="baab-alert" role="status">{t(note)}</p>

	let body
	if (session.state === 'unknown') {
		body = <p className="baab-lead">{t('baab.asking')}</p>
	} else if (session.state === 'in') {
		body = (
			<Inside
				key={session.profile.handle}
				t={t}
				profile={session.profile}
				busy={busy}
				alert={alert}
				onRename={nickname => run(() => baab.rename(nickname).then(ok => (ok ? 'saved' : 'down')), { saved: 'baab.saved', down: 'baab.down' })}
				onLeave={() => run(() => baab.leave().then(() => 'out'), {})}
			/>
		)
	} else if (pending !== null) {
		body = (
			<form
				className="baab-form"
				onSubmit={e => {
					e.preventDefault()
					if (CODE.test(code) && !busy) void enter()
				}}
			>
				<p className="baab-lead">{t('baab.sentTo')} <b className="baab-address" translate="no">{pending}</b></p>
				<label className="baab-field">
					<span className="baab-label">{t('baab.code')}</span>
					<input
						className="baab-input baab-code"
						type="text"
						inputMode="numeric"
						autoComplete="one-time-code"
						maxLength={6}
						value={code}
						onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
						autoFocus
					/>
				</label>
				<p className="baab-note">{t('baab.codeNote')}</p>
				{alert}
				<div className="baab-actions">
					<span className="baab-links">
						<button type="button" className="baab-link" disabled={busy} onClick={() => void knock(pending)}>{t('baab.again')}</button>
						<button
							type="button"
							className="baab-link"
							onClick={() => {
								baab.forget()
								setCode('')
								setNote(null)
							}}
						>
							{t('baab.another')}
						</button>
					</span>
					<button type="submit" disabled={!CODE.test(code) || busy}>{t('baab.enter')}</button>
				</div>
			</form>
		)
	} else {
		body = (
			<form
				className="baab-form"
				onSubmit={e => {
					e.preventDefault()
					if (canKnock) void knock(email)
				}}
			>
				<p className="baab-lead">{t('baab.lead')}</p>
				<label className="baab-field">
					<span className="baab-label">{t('baab.email')}</span>
					<input
						className={'baab-input' + (emailOk ? '' : ' invalid')}
						type="email"
						inputMode="email"
						autoComplete="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						autoFocus
					/>
				</label>
				<p className="baab-note">{t('baab.emailNote')}</p>
				<p className="baab-note">{t('baab.stay')}</p>
				{alert}
				<div className="baab-actions">
					<button type="submit" disabled={!canKnock}>{t('baab.send')}</button>
				</div>
			</form>
		)
	}

	return (
		<div className="baab-sheet" role="dialog" aria-label={t('baab.title')} dir={dir} ref={sheetRef}>
			<div className="baab-head">
				<h2 className="baab-title">{t('baab.title')}</h2>
				<button type="button" className="baab-close" aria-label={t('baab.close')} title={t('baab.close')} onClick={onClose}>✕</button>
			</div>
			{body}
		</div>
	)
}

/*
 * Signed in: the handle, the nickname and the way out. Keyed by handle
 * from outside, so a fresh sign-in starts the nickname field from what
 * baab has, not from what was typed before.
 */
function Inside({ t, profile, busy, alert, onRename, onLeave }: Readonly<{
	t: Translate,
	profile: Profile,
	busy: boolean,
	alert: ReactNode,
	onRename: (nickname: string) => Promise<unknown>,
	onLeave: () => Promise<unknown>,
}>) {
	const [nickname, setNickname] = useState(profile.nickname ?? '')
	const trimmed = nickname.trim()
	const canSave = trimmed !== '' && trimmed !== (profile.nickname ?? '') && !busy

	return (
		<div className="baab-form">
			<div className="baab-field">
				<span className="baab-label">{t('baab.handle')}</span>
				<span className="baab-handle" translate="no">{profile.handle}</span>
				<span className="baab-note">{t('baab.handleNote')}</span>
			</div>
			<form
				className="baab-field"
				onSubmit={e => {
					e.preventDefault()
					if (canSave) void onRename(trimmed)
				}}
			>
				<label className="baab-label" htmlFor="baab-nickname">{t('baab.nickname')}</label>
				<span className="baab-row">
					<input
						id="baab-nickname"
						className="baab-input"
						type="text"
						maxLength={24}
						autoComplete="nickname"
						value={nickname}
						onChange={e => setNickname(e.target.value)}
					/>
					<button type="submit" disabled={!canSave}>{t('baab.save')}</button>
				</span>
				<span className="baab-note">{t('baab.nicknameNote')}</span>
			</form>
			{alert}
			<p className="baab-note">{t('baab.stay')}</p>
			<div className="baab-actions">
				<button type="button" disabled={busy} onClick={() => void onLeave()}>{t('baab.leave')}</button>
			</div>
		</div>
	)
}
