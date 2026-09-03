/*
 * The courtyard's two pieces of screen, shared by every app that joins one.
 *
 * `RaceScore` is the app-bar segment: who is here and how they are doing,
 * which replaces the solo 🏁/👎 score while a room is on.
 *
 * `RacePanel` is 🏟️ itself — opening a room, joining one by its six digits,
 * the lobby, and the scoreboard at the end. The one field in it takes digits
 * and nothing else: everything else a child chooses here is a picture from a
 * list the server owns, and the code they type is checked against the rooms
 * that exist before it can reach one.
 *
 * Both take a translate function as a prop rather than importing i18n, the
 * same way GameScore and GameActions do — these stay presentational.
 */
import { useEffect, useState } from 'react'

import { Race } from './useRace'
import { ROOM_CODE_LEN, digitsOf, probeRoom, readRoomCode } from './saha'

type Translate = (key: string) => string

/** Who is in the courtyard, and how the race is going. */
export function RaceScore({ race, t }: Readonly<{ race: Race, t: Translate }>) {
	const avatars = race.palettes?.avatars ?? []
	// most points first, so the child in front is always on the left
	const ranked = [...race.players].sort((a, b) => b.score - a.score || a.mistakes - b.mistakes)
	return (
		<div className="race-score" title={t('race.scoreTitle')}>
			{ranked.map(p => (
				<span
					key={p.playerId}
					className={
						'race-player'
						+ (p.playerId === race.me ? ' me' : '')
						+ (p.connected ? '' : ' away')
						+ (race.winners?.includes(p.playerId) ? ' winner' : '')
					}
					title={p.connected ? undefined : t('race.away')}
				>
					<span className="race-avatar">{avatars[p.avatar] ?? '·'}</span>
					{race.winners?.includes(p.playerId) ? '🏆' : ''} {p.score}
				</span>
			))}
		</div>
	)
}

type PanelProps = {
	race: Race,
	t: Translate,
	// a link that brings a friend straight into this room
	inviteUrl: (room: string) => string,
	// copied from the URL on load: ?room=004271 fills the code in for them
	initialCode?: string,
	// the app's own copy-link helper, so 🔗 behaves as it does everywhere else
	onCopyInvite: (url: string) => void,
	copyIcon: string,
	/*
	 * A sound id as this child reads it — `ar` → "Arabic", `choral` → 👥. The
	 * app owns this because the app owns its list of sounds, and that ownership
	 * is also the guard: an id no build knows resolves to '', and an unnamed
	 * sound is drawn as a lock with no name rather than as somebody's word on a
	 * child's screen. An app with no choice of sounds passes nothing.
	 */
	soundName?: (id: string) => string,
}

/*
 * An invite link is the same thing as having typed its six digits, so it is
 * read as exactly that — derived, not copied into state by an effect. `null`
 * everywhere below means "the child has not touched this yet", which is what
 * lets the link decide the opening state without ever fighting a later tap.
 */
/*
 * Server error codes outlive any one app's dictionary — a build that has not
 * learned a new one should say something a child can read, not print the key.
 * The translator returns the key itself when it has no entry, which is how
 * this tells the difference.
 */
const errorText = (t: Translate, code: string): string => {
	const key = `race.error.${code}`
	const said = t(key)
	return said === key ? t('race.error.other') : said
}

/*
 * What this room sounds like, in one line: "🔒 Everyone hears: Arabic", or the
 * 🔓 that means each child plays in their own. The name is appended rather
 * than dropped into the middle of a sentence, because the eight interface
 * languages do not agree on where in a sentence that would be — which is also
 * why `race.hears` carries its own punctuation.
 *
 * A sound this build cannot name still gets the lock — the child should know
 * the room is held to something — but never the raw id, which is the only part
 * of it a stranger could have chosen.
 */
export const soundLine = (t: Translate, sound: string | null, name?: (id: string) => string): string => {
	if (!sound) return `🔓 ${t('race.hearsOwn')}`
	const said = name?.(sound) ?? ''
	return said ? `🔒 ${t('race.hears')} ${said}` : `🔒 ${t('race.hearsOne')}`
}

/** The six digits a `?room=` link brought, or null if it brought nonsense. */
const invited = (code?: string): string | null =>
	code ? readRoomCode(code) : null

export function RacePanel({ race, t, inviteUrl, initialCode, onCopyInvite, copyIcon, soundName }: Readonly<PanelProps>) {
	const fromLink = invited(initialCode)
	// null until the child opens or closes it themselves
	const [openState, setOpen] = useState<boolean | null>(null)
	// the digits so far, however they arrived: tapped, typed or pasted
	const [typedState, setTyped] = useState<string | null>(null)
	const [modeState, setMode] = useState<'choose' | 'joining' | 'opening' | null>(null)
	const [taken, setTaken] = useState<number[]>([])
	const [unknown, setUnknown] = useState(false)
	// what the probe said this room is held to, before there is any socket
	const [glanceSound, setGlanceSound] = useState<string | null>(null)

	const palettes = race.palettes
	const avatars = palettes?.avatars ?? []

	const code = typedState ?? (race.on ? '' : fromLink ?? '')
	const mode = modeState ?? (fromLink && !race.on ? 'joining' : 'choose')
	// a room in play takes the whole screen: the sheet has nothing to add
	const open = (openState ?? Boolean(fromLink && palettes)) && race.phase !== 'playing'

	/*
	 * Once all six digits are in, ask whether that room is real and who is
	 * already in it. Only then: the asking is rate-limited at the other end, and
	 * a code is not a code until it is six long.
	 */
	useEffect(() => {
		if (mode !== 'joining' || code.length !== ROOM_CODE_LEN) return
		let alive = true
		void (async () => {
			const glance = await probeRoom(code)
			if (!alive) return
			setUnknown(glance === null || !glance.joinable)
			setTaken(glance?.takenAvatars ?? [])
			setGlanceSound(glance?.sound ?? null)
		})()
		return () => {
			alive = false
		}
	}, [mode, code])

	if (!race.available) return null

	const reset = () => {
		setTyped('')
		setTaken([])
		setUnknown(false)
		setGlanceSound(null)
		setMode('choose')
	}

	/*
	 * Every way a digit can arrive funnels through here: a tapped key, a typed
	 * one, a pasted code, a code written with spaces in it. `digitsOf` throws
	 * away everything that is not a digit and turns an Arabic or Persian one
	 * into the ASCII digit it means, so what is on screen is always what the
	 * server will be asked about.
	 */
	const enter = (value: string) => {
		setTyped(digitsOf(value).slice(0, ROOM_CODE_LEN))
		setUnknown(false)
	}
	const tapDigit = (d: number) => enter(code + d)
	const backspace = () => enter(code.slice(0, -1))

	const pickAvatar = (i: number) => {
		if (mode === 'opening') race.create(i)
		else race.join(code, i)
		// the sheet stays open: what comes next is the room's own six digits and
		// the 🔗 beside them, which is the whole point of having opened one
		reset()
	}

	const full = code.length === ROOM_CODE_LEN
	const ready = mode === 'joining' && full && !unknown
	/** six digits that turned out not to be a room anyone can join */
	const wrongCode = mode === 'joining' && full && unknown

	return (
		<div className="race-panel">
			<button
				className={race.on ? 'race-toggle on' : 'race-toggle'}
				aria-label={t('race.open')}
				aria-pressed={race.on}
				title={race.on ? t('race.inRoom') : t('race.openTitle')}
				onClick={() => {
					setOpen(o => !o)
					if (!race.on) reset()
				}}
			>
				🏟️
			</button>

			{open && (
				<div className="race-sheet">
					{/* ---------------------------------------------- not in a room */}
					{!race.on && mode === 'choose' && (
						<>
							<p className="race-lead">{t('race.lead')}</p>
							<div className="race-choices">
								<button onClick={() => setMode('opening')}>🏟️ {t('race.create')}</button>
								<button onClick={() => setMode('joining')}>🔢 {t('race.join')}</button>
							</div>
						</>
					)}

					{/*
					  * Six digits, and three ways to put them in — because the
					  * three devices this runs on do not agree on what is easy.
					  *
					  * The field itself is `inputMode="numeric"`, which is what
					  * raises a phone's number pad rather than its alphabet, and
					  * autofocus is what raises it without the child having to
					  * know to tap the box first. On a laptop the same focus
					  * means the code can simply be typed. And the keypad stays
					  * for the tablet in the middle, where there is no hardware
					  * keyboard and a five-year-old's aim is better served by
					  * nine big buttons than by an on-screen keyboard covering
					  * half the room.
					  *
					  * Field, keypad, then one line of status — in that order and
					  * never otherwise. The keypad does not come and go with the
					  * sixth digit, and the message does not move: both used to,
					  * and the result was a screen that jumped under a child's
					  * finger at the exact moment they were told they had got it
					  * wrong. The line holds its height whether it has anything
					  * to say or not, for the same reason.
					  */}
					{!race.on && mode === 'joining' && (
						<>
							<div className="race-code">
								<input
									className="race-digits"
									type="text"
									inputMode="numeric"
									autoComplete="off"
									autoCorrect="off"
									spellCheck={false}
									autoFocus
									maxLength={ROOM_CODE_LEN}
									aria-label={t('race.typeSix')}
									placeholder={'·'.repeat(ROOM_CODE_LEN)}
									value={code}
									onChange={e => enter(e.target.value)}
								/>
								<button
									className="race-back"
									aria-label={t('race.undo')}
									disabled={code.length === 0}
									onClick={backspace}
								>
									⌫
								</button>
							</div>
							<div className="race-keypad">
								{[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(d => (
									<button
										key={`key-${d}`}
										onClick={() => tapDigit(d)}
										/*
										 * Full, and so a tap would change nothing.
										 * Saying that with a greyed key is kinder
										 * than a button that silently does nothing
										 * — ⌫ is the way out, and it stays lit.
										 */
										disabled={full}
										aria-label={String(d)}
									>
										{d}
									</button>
								))}
							</div>
							{/*
							  * One line, always here, in one of three states: the
							  * prompt while the digits go in, why not when six of
							  * them are not a room, and empty once the room is
							  * found — at which point the animals below are what
							  * the child should be looking at.
							  */}
							<p
								className={wrongCode ? 'race-status wrong' : 'race-status'}
								aria-live="polite"
							>
								{wrongCode ? t('race.noRoom') : (ready ? '' : t('race.typeSix'))}
							</p>
						</>
					)}

					{/* pick an animal to be, then go in */}
					{!race.on && (mode === 'opening' || ready) && (
						<>
							{/*
							  * Only when joining, and only when the room is held to
							  * something: a child about to walk into a race played
							  * in a language they are still learning should hear
							  * about it while backing out is still free. Opening a
							  * room has nothing to warn anyone about.
							  */}
							{ready && glanceSound && (
								<p className="race-sound">{soundLine(t, glanceSound, soundName)}</p>
							)}
							<p className="race-lead">{t('race.pickAvatar')}</p>
							<div className="race-avatars">
								{avatars.map((emoji, i) => (
									<button
										key={`avatar-${emoji}`}
										disabled={taken.includes(i)}
										aria-label={emoji}
										onClick={() => pickAvatar(i)}
									>
										{emoji}
									</button>
								))}
							</div>
						</>
					)}

					{/* ---------------------------------------------------- in a room */}
					{race.on && (
						<>
							<div className="race-room">
								<span className="race-room-code">{race.room}</span>
								<button
									className="race-invite"
									title={t('race.invite')}
									aria-label={t('race.invite')}
									onClick={() => onCopyInvite(inviteUrl(race.room))}
								>
									{copyIcon}
								</button>
							</div>
							<p className="race-lead">
								{race.phase === 'lobby' && t('race.waiting')}
								{race.phase === 'dealing' && t('race.dealing')}
								{race.phase === 'connecting' && t('race.connecting')}
								{race.phase === 'finished' && (
									race.winners?.includes(race.me) ? t('race.youWon') : t('race.roundOver')
								)}
							</p>
							<div className="race-here">
								{race.players.map(p => (
									<span
										key={p.playerId}
										className={'race-avatar' + (p.connected ? '' : ' away')}
									>
										{avatars[p.avatar] ?? '·'}
									</span>
								))}
							</div>
							{/*
							  * What everyone in here is listening to, and — for the
							  * host — the switch. Two lines rather than one: the
							  * first says what the room *is*, the button says what
							  * pressing it would do, which is the only way a lock
							  * with two states is unambiguous to a small child.
							  *
							  * The line is shown to everybody, because "we are all
							  * hearing Arabic" is exactly the sort of thing a guest
							  * needs to know and cannot deduce.
							  */}
							{soundName && (
								<p className="race-sound">{soundLine(t, race.sound, soundName)}</p>
							)}
							<div className="race-choices">
								{race.canEnforce && (
									<button
										className={race.locked ? 'race-hold on' : 'race-hold'}
										aria-pressed={race.locked}
										onClick={() => race.enforce(!race.locked)}
									>
										{race.locked ? `🔓 ${t('race.free')}` : `🔒 ${t('race.hold')}`}
									</button>
								)}
							</div>
							<div className="race-choices">
								{race.isHost && (race.phase === 'lobby' || race.phase === 'finished') && (
									<button onClick={race.start}>
										▶️ {race.phase === 'finished' ? t('race.again') : t('race.begin')}
									</button>
								)}
								<button onClick={race.leave}>🚪 {t('race.leave')}</button>
							</div>
							{!race.isHost && race.phase === 'lobby' && (
								<p className="race-note">{t('race.waitForHost')}</p>
							)}
						</>
					)}

					{race.error && <p className="race-note">{errorText(t, race.error)}</p>}
				</div>
			)}

			{/* the courtyard closed under us: say so once, then be the solo app again */}
			{race.phase === 'lost' && (
				<div className="race-sheet">
					<p className="race-lead">{t('race.lost')}</p>
					<div className="race-choices">
						<button onClick={race.dismiss}>👍 {t('race.gotIt')}</button>
					</div>
				</div>
			)}
		</div>
	)
}
