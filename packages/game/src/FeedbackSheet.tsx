/*
 * A sheet for telling the developer something, from inside the app. One
 * dropdown at the top says what kind of thing it is, and the fields below
 * follow from that: a bug or a request wants a title and some context — which
 * interface language, which sound, which colours — while "something else" is
 * a message and a way to answer. Everything but the title (or the message) is
 * optional, and the app fills in what it can on the child's behalf: its
 * version, and the languages it is set to right now.
 *
 * It is its own view, not a tab of ⚙️: a form is a different kind of thing
 * from a setting, and it should not be under a panel that closes on a click
 * outside. Which is also how this closes — ✕, Escape, or a click anywhere
 * else — the way the courtyard's sheet does.
 *
 * What it sends is fire-and-forget through the same gate as every other post
 * to sada, so "sent" means "handed to the browser", never "received". That is
 * the most this end can honestly say, and the note under the thanks says it.
 *
 * Shared by every app, the way the courtyard's sheet is: the app hands in its
 * translator, its language lists, and — the one thing that differs between
 * apps — how an item is drawn, as a node per item (a swatch, a flag, a
 * silhouette). The styles live per app in index.css, like the 🏟️ ones.
 */
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { FeedbackKind } from './sada'

type Translate = (key: string) => string

type Props = {
	t: Translate,
	// which way the interface language reads; the whole sheet follows it —
	// labels, fields, the ✕, the order of "optional" after a label
	dir: 'ltr' | 'rtl',
	// the interface and sound languages on offer, already named in the interface language
	uiLanguages: { code: string, display: string }[],
	// the sound (or, for Anthem, the rendering) choices; left out, the field is not drawn
	sounds?: { code: string, display: string }[],
	// the things a report can point at — colours, flags, days — each drawn the
	// app's own way; left out, the field is not drawn
	items?: { code: string, label: string, node: ReactNode }[],
	// what the app is set to right now — context the child need not type
	context: { version: string, uiLanguage: string, sound: string },
	onSend: (kind: FeedbackKind, info: Record<string, unknown>) => void,
	onClose: () => void,
}

const KINDS: FeedbackKind[] = ['bug', 'add', 'other']

// "all of them" and "not about a particular one" sit beside the real choices
const ALL = 'all'
const NA = 'na'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LINK = /^https?:\/\/\S+$/i

export function FeedbackSheet({ t, dir, uiLanguages, sounds, items: choices, context, onSend, onClose }: Readonly<Props>) {
	const [kind, setKind] = useState<FeedbackKind>('bug')
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [message, setMessage] = useState('')
	const [email, setEmail] = useState('')
	const [link, setLink] = useState('')
	const [uiLanguage, setUiLanguage] = useState(NA)
	const [sound, setSound] = useState(NA)
	const [items, setItems] = useState<string[]>([])
	const [sent, setSent] = useState(false)
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

	const toggleItem = (code: string) =>
		setItems(prev => (prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]))

	// a bug or a request needs a title; anything else needs the message. An
	// email or a link, if given, has to look like one
	const emailOk = email.trim() === '' || EMAIL.test(email.trim())
	const linkOk = link.trim() === '' || LINK.test(link.trim())
	const filled = kind === 'other' ? message.trim() !== '' : title.trim() !== ''
	const canSend = filled && emailOk && linkOk

	const send = () => {
		if (!canSend) return
		// only what was actually given travels; the collector stores it verbatim
		const info: Record<string, unknown> = { version: context.version, context: { uiLanguage: context.uiLanguage, sound: context.sound } }
		const put = (key: string, value: string) => {
			if (value.trim() !== '') info[key] = value.trim()
		}
		if (kind === 'other') {
			put('message', message)
		} else {
			put('title', title)
			put('description', description)
			if (kind === 'add') put('link', link)
			if (uiLanguage !== NA) info.uiLanguage = uiLanguage
			if (sound !== NA) info.sound = sound
			if (items.length > 0) info.items = items
		}
		put('email', email)
		onSend(kind, info)
		setSent(true)
	}

	const field = (key: string, optional = true) => (
		<span className="feedback-label">
			{t(key)}
			{optional && <span className="feedback-optional"> · {t('feedback.optional')}</span>}
		</span>
	)

	return (
		<div className="feedback-sheet" role="dialog" aria-label={t('feedback.title')} dir={dir} ref={sheetRef}>
			<div className="feedback-head">
				<h2 className="feedback-title">{t('feedback.title')}</h2>
				<button type="button" className="feedback-close" aria-label={t('feedback.close')} title={t('feedback.close')} onClick={onClose}>✕</button>
			</div>

			{sent ? (
				<>
					<p className="feedback-lead">{t('feedback.sent')}</p>
					<p className="feedback-note">{t('feedback.sentNote')}</p>
					<div className="feedback-actions">
						<button type="button" onClick={onClose}>{t('feedback.close')}</button>
					</div>
				</>
			) : (
				<form
					className="feedback-form"
					onSubmit={e => {
						e.preventDefault()
						send()
					}}
				>
					<label className="feedback-field">
						<span className="feedback-label">{t('feedback.kind')}</span>
						<select className="language-select" value={kind} onChange={e => setKind(e.target.value as FeedbackKind)}>
							{KINDS.map(k => <option key={k} value={k}>{t(`feedback.kind.${k}`)}</option>)}
						</select>
					</label>

					{kind === 'other' ? (
						<label className="feedback-field">
							{field('feedback.message', false)}
							<textarea className="feedback-input" rows={4} value={message} onChange={e => setMessage(e.target.value)} autoFocus/>
						</label>
					) : (
						<>
							<label className="feedback-field">
								{field('feedback.subject', false)}
								<input className="feedback-input" type="text" value={title} onChange={e => setTitle(e.target.value)} autoFocus/>
							</label>
							<label className="feedback-field">
								{field('feedback.description')}
								<textarea className="feedback-input" rows={3} value={description} onChange={e => setDescription(e.target.value)}/>
							</label>
							{kind === 'add' && (
								<label className="feedback-field">
									{field('feedback.link')}
									<input className={'feedback-input' + (linkOk ? '' : ' invalid')} type="url" inputMode="url" placeholder="https://" value={link} onChange={e => setLink(e.target.value)}/>
								</label>
							)}
							<label className="feedback-field">
								{field('feedback.uiLanguage')}
								<select className="language-select" value={uiLanguage} onChange={e => setUiLanguage(e.target.value)}>
									<option value={NA}>{t('feedback.na')}</option>
									<option value={ALL}>{t('feedback.all')}</option>
									{uiLanguages.map(l => <option key={l.code} value={l.code}>{l.display}</option>)}
								</select>
							</label>
							{sounds && (
								<label className="feedback-field">
									{field('feedback.sound')}
									<select className="language-select" value={sound} onChange={e => setSound(e.target.value)}>
										<option value={NA}>{t('feedback.na')}</option>
										<option value={ALL}>{t('feedback.all')}</option>
										{sounds.map(l => <option key={l.code} value={l.code}>{l.display}</option>)}
									</select>
								</label>
							)}
							{choices && (
								<div className="feedback-field">
									{field('feedback.items')}
									<div className="feedback-items" role="group" aria-label={t('feedback.items')}>
										{choices.map(c => {
											const on = items.includes(c.code)
											return (
												<button
													key={c.code}
													type="button"
													className={on ? 'feedback-item' : 'feedback-item off'}
													aria-pressed={on}
													aria-label={c.label}
													title={c.label}
													onClick={() => toggleItem(c.code)}
												>
													{c.node}
												</button>
											)
										})}
									</div>
								</div>
							)}
						</>
					)}

					<label className="feedback-field">
						{field('feedback.email')}
						<input className={'feedback-input' + (emailOk ? '' : ' invalid')} type="email" inputMode="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}/>
					</label>

					<div className="feedback-actions">
						<button type="submit" disabled={!canSend}>{t('feedback.send')}</button>
					</div>
				</form>
			)}
		</div>
	)
}
