/*
 * The courtyard's two pieces of screen, shared by every app that joins one.
 *
 * `RaceScore` is the app-bar segment: who is here and how they are doing,
 * which replaces the solo 🏁/👎 score while a room is on.
 *
 * `RacePanel` is 🏟️ itself — opening a room, joining one by tapping four
 * animals, the lobby, and the scoreboard at the end. There is no text field
 * anywhere in it, and there never will be: a child taps pictures, and every
 * picture comes from a list the server owns.
 *
 * Both take a translate function as a prop rather than importing i18n, the
 * same way GameScore and GameActions do — these stay presentational.
 */
import { useEffect, useState } from 'react'

import { Race } from './useRace'
import { ALPHABET, codeOfEmoji, probeRoom } from './saha'

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
	// copied from the URL on load: ?room=BKQF puts a code in the keypad
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
 * An invite link is the same thing as having tapped its four animals, so it is
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

const invited = (code?: string): number[] | null => {
	if (!code) return null
	const seats = [...code.toUpperCase()].map(ch => ALPHABET.indexOf(ch))
	return seats.length === 4 && seats.every(i => i >= 0) ? seats : null
}

export function RacePanel({ race, t, inviteUrl, initialCode, onCopyInvite, copyIcon, soundName }: Readonly<PanelProps>) {
	const fromLink = invited(initialCode)
	// null until the child opens or closes it themselves
	const [openState, setOpen] = useState<boolean | null>(null)
	// what the child has tapped so far: positions in the room palette
	const [pickedState, setPicked] = useState<number[] | null>(null)
	const [modeState, setMode] = useState<'choose' | 'joining' | 'opening' | null>(null)
	const [taken, setTaken] = useState<number[]>([])
	const [unknown, setUnknown] = useState(false)
	// what the probe said this room is held to, before there is any socket
	const [glanceSound, setGlanceSound] = useState<string | null>(null)

	const palettes = race.palettes
	const roomPalette = palettes?.roomEmoji ?? []
	const avatars = palettes?.avatars ?? []

	const picked = pickedState ?? (race.on ? [] : fromLink ?? [])
	const mode = modeState ?? (fromLink && !race.on ? 'joining' : 'choose')
	// a room in play takes the whole screen: the sheet has nothing to add
	const open = (openState ?? Boolean(fromLink && palettes)) && race.phase !== 'playing'

	/*
	 * Once four animals are tapped, ask whether that room is real and who is
	 * already in it. The dependency is the *code*, not the array it came from:
	 * a derived array is a new array every render, and this asking has a rate
	 * limit at the other end.
	 */
	const code = codeOfEmoji(picked)
	useEffect(() => {
		if (mode !== 'joining' || code.length !== 4) return
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
		setPicked([])
		setTaken([])
		setUnknown(false)
		setGlanceSound(null)
		setMode('choose')
	}

	const tapAnimal = (i: number) => setPicked([...picked, i])
	const undoAnimal = () => {
		setPicked(picked.slice(0, -1))
		setUnknown(false)
	}

	const pickAvatar = (i: number) => {
		if (mode === 'opening') race.create(i)
		else race.join(code, i)
		// the sheet stays open: what comes next is the room's own four animals
		// and the 🔗 beside them, which is the whole point of having opened one
		reset()
	}

	const ready = mode === 'joining' && picked.length === 4 && !unknown

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
								<button onClick={() => setMode('joining')}>🐾 {t('race.join')}</button>
							</div>
						</>
					)}

					{/* the keypad: four animals, no keyboard, no letters */}
					{!race.on && mode === 'joining' && (
						<>
							<p className="race-lead">{t('race.tapFour')}</p>
							<div className="race-code" aria-live="polite">
								{[0, 1, 2, 3].map(i => (
									<span key={`slot-${i}`} className="race-slot">
										{picked[i] !== undefined ? roomPalette[picked[i]] : '·'}
									</span>
								))}
								<button
									className="race-back"
									aria-label={t('race.undo')}
									disabled={picked.length === 0}
									onClick={undoAnimal}
								>
									⌫
								</button>
							</div>
							{picked.length === 4 && unknown && <p className="race-note">{t('race.noRoom')}</p>}
							{picked.length < 4 && (
								<div className="race-keypad">
									{roomPalette.map((emoji, i) => (
										<button
											key={`key-${emoji}`}
											onClick={() => tapAnimal(i)}
											aria-label={emoji}
										>
											{emoji}
										</button>
									))}
								</div>
							)}
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
								<span className="race-room-code">{race.roomEmoji}</span>
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
