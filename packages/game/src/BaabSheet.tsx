/*
 * The sign-in sheet: baab, as a page shows it. Three views, one at a
 * time, chosen by what the session is — an email field when nobody is in, a
 * code field once a code has gone out, and the account itself behind it: the
 * handle on its plate, the nickname, and the way out.
 *
 * It says out loud what the rules ask a sign-in to say: that signing in keeps
 * you signed in on this device for 180 days. The rest is baab's own
 * promise, repeated — only a keyed hash of the address is ever kept — and,
 * under every view, the way to the whole of it: the privacy notice on the
 * landing page, in a tab of its own so a round in play is not lost.
 *
 * Its own view, not a panel: it closes on ✕, Escape, or a click anywhere
 * else, the way the feedback and courtyard sheets do. Shared by every app
 * the way those are — the app hands in its translator and its reading
 * direction, and styles the class names in its own index.css.
 */
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Baab } from './useBaab'
import { MAIL_LANGUAGES } from './baab'
import type { Entry, Profile } from './baab'

type Translate = (key: string) => string

type Props = {
	t: Translate,
	// which way the interface language reads; the whole sheet follows it
	dir: 'ltr' | 'rtl',
	// the interface language, asked of baab first for a new account's mail;
	// the browser's own languages follow it
	language?: string,
	baab: Baab,
	onClose: () => void,
}

// one notice for the landing page and every app, so an absolute address
const PRIVACY_URL = 'https://sawt.info/privacy'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CODE = /^\d{6}$/

// what arriving by link has to say, if anything
const ARRIVAL_NOTE: Record<Entry, string | null> = {
	in: 'baab.arrived',
	wrong: 'baab.linkWrong',
	down: 'baab.down',
}

export function BaabSheet({ t, dir, language, baab, onClose }: Readonly<Props>) {
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
		run(() => baab.knock(address, language), { wait: 'baab.wait', refused: 'baab.refused', down: 'baab.down' })

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
				onLanguage={choice => run(() => baab.setLanguage(choice).then(ok => (ok ? 'saved' : 'down')), { saved: 'baab.saved', down: 'baab.down' })}
				onLeave={() => run(() => baab.leave().then(() => 'out'), {})}
				onProve={address => run(() => baab.prove(address), { wait: 'baab.wait', refused: 'baab.refused', down: 'baab.down' })}
				onErase={digits => run(() => baab.erase(digits), { gone: 'baab.deleted', wrong: 'baab.wrong', down: 'baab.down' })}
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
			<p className="baab-privacy">
				<a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">{t('baab.privacy')}</a>
			</p>
		</div>
	)
}

/*
 * Signed in: the handle, the nickname and the way out. Keyed by handle
 * from outside, so a fresh sign-in starts the nickname field from what
 * baab has, not from what was typed before.
 */
function Inside({ t, profile, busy, alert, onRename, onLanguage, onLeave, onProve, onErase }: Readonly<{
	t: Translate,
	profile: Profile,
	busy: boolean,
	alert: ReactNode,
	onRename: (nickname: string) => Promise<unknown>,
	onLanguage: (language: string) => Promise<string>,
	onLeave: () => Promise<unknown>,
	onProve: (email: string) => Promise<string>,
	onErase: (code: string) => Promise<unknown>,
}>) {
	const [nickname, setNickname] = useState(profile.nickname ?? '')
	/*
	 * The language baab mails this account in — a choice saved the moment it
	 * changes, since there is nothing to type, and put back if baab refuses
	 * it. A language baab knows and this list does not yet is still shown,
	 * by its code, so the field never claims a choice that is not the one.
	 */
	const [language, setLanguage] = useState(profile.language)
	const languages = MAIL_LANGUAGES.some(l => l.code === profile.language)
		? MAIL_LANGUAGES
		: [...MAIL_LANGUAGES, { code: profile.language, name: profile.language }]
	const chooseLanguage = async (choice: string) => {
		setLanguage(choice)
		if (await onLanguage(choice) !== 'saved') setLanguage(profile.language)
	}
	/*
	 * Deleting the account is the one thing here that cannot be undone, so it
	 * takes proof that the inbox is at hand, as baab asks since 0.5.0 — on a
	 * shared computer the browser may not be in its owner's hands. A box of
	 * its own says what goes and what stays and asks for the account's email;
	 * baab mails a code to it; only that code, typed back, unlocks the red
	 * yes. No countdown and no taking itself back: the mailed code is the
	 * guard now, and a box that closed while its owner fetched the mail would
	 * only be in the way. The way back is a full button, the easy one to hit.
	 */
	const [step, setStep] = useState<'email' | 'code' | null>(null)
	const [eraseEmail, setEraseEmail] = useState('')
	const [eraseCode, setEraseCode] = useState('')
	const fieldRef = useRef<HTMLInputElement | null>(null)
	// each step opens on its own field
	useEffect(() => {
		if (step) fieldRef.current?.focus()
	}, [step])
	const canProve = EMAIL.test(eraseEmail.trim()) && !busy
	const canErase = CODE.test(eraseCode) && !busy
	const prove = async () => {
		const outcome = await onProve(eraseEmail.trim())
		// a code that went out a minute ago is as good as a new one
		if (outcome === 'sent' || outcome === 'wait') setStep('code')
	}
	const back = () => {
		setStep(null)
		setEraseCode('')
	}
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
			<div className="baab-field">
				<label className="baab-label" htmlFor="baab-language">{t('baab.language')}</label>
				<select
					id="baab-language"
					className="baab-input"
					value={language}
					disabled={busy}
					onChange={e => void chooseLanguage(e.target.value)}
				>
					{languages.map(l => (
						<option key={l.code} value={l.code} lang={l.code}>{l.name}</option>
					))}
				</select>
				<span className="baab-note">{t('baab.languageNote')}</span>
			</div>
			{alert}
			<p className="baab-note">{t('baab.stay')}</p>
			{step ? (
				<form
					className="baab-confirm"
					role="alertdialog"
					aria-label={t('baab.delete')}
					onSubmit={e => {
						e.preventDefault()
						if (step === 'email' && canProve) void prove()
						if (step === 'code' && canErase) void onErase(eraseCode)
					}}
				>
					<p className="baab-note">{t('baab.deleteAsk')}</p>
					{step === 'email' ? (
						<>
							<label className="baab-field">
								<span className="baab-label">{t('baab.email')}</span>
								<input
									ref={fieldRef}
									className="baab-input"
									type="email"
									inputMode="email"
									autoComplete="email"
									value={eraseEmail}
									onChange={e => setEraseEmail(e.target.value)}
								/>
							</label>
							<p className="baab-note">{t('baab.deleteProve')}</p>
						</>
					) : (
						<>
							<p className="baab-note">{t('baab.deleteSent')}</p>
							<label className="baab-field">
								<span className="baab-label">{t('baab.code')}</span>
								<input
									ref={fieldRef}
									className="baab-input baab-code"
									type="text"
									inputMode="numeric"
									autoComplete="one-time-code"
									maxLength={6}
									value={eraseCode}
									onChange={e => setEraseCode(e.target.value.replace(/\D/g, ''))}
								/>
							</label>
						</>
					)}
					<div className="baab-actions">
						<button type="button" onClick={back}>{t('baab.deleteCancel')}</button>
						{step === 'code' && (
							<button type="button" className="baab-link" disabled={busy} onClick={() => void prove()}>{t('baab.again')}</button>
						)}
						{step === 'email'
							? <button type="submit" disabled={!canProve}>{t('baab.send')}</button>
							: <button type="submit" className="baab-danger" disabled={!canErase}>{t('baab.deleteYes')}</button>}
					</div>
				</form>
			) : (
				<div className="baab-actions">
					<button
						type="button"
						className="baab-link"
						disabled={busy}
						onClick={() => setStep('email')}
					>
						{t('baab.delete')}
					</button>
					<button type="button" disabled={busy} onClick={() => void onLeave()}>{t('baab.leave')}</button>
				</div>
			)}
		</div>
	)
}
