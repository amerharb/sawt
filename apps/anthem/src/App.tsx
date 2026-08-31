import './App.css'

import { useCallback, useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'

import { isVisible } from '@sawt/feature-flags'
import { readUrlParams, writeUrlParams, hiddenFrom } from '@sawt/url-state'
import { shuffle, sortByCodeOrName } from '@sawt/order'
import { useGame, useRace, useSadaSettings } from '@sawt/game'
import { useCopyLink, COPY_ICON, useFitText } from '@sawt/ui'

import SettingsPanel from './SettingsPanel'
import { GameScore, GameActions, ResultsPeek, RaceScore, RacePanel } from './GameHud'
import { Country, Language } from './countries/Country'
import {
	Settings,
	DisplayMode,
	SortMode,
	DEFAULT_SETTINGS,
	loadSettings,
	saveSettings,
	applyTheme,
} from './settingsStore'
import { ensureCached, idbCount, idbClear } from './audioCache'
import { useAudio, clipUrl, Clip } from './useAudio'
import { translator, UI_LANGUAGES } from './i18n'
import { sy } from './countries/sy'
import { iq } from './countries/iq'
import { lb } from './countries/lb'
import { ae } from './countries/ae'
import { om } from './countries/om'
import { us } from './countries/us'
import { th } from './countries/th'
import { tr } from './countries/tr'
import { gr } from './countries/gr'
import { se } from './countries/se'
import { al } from './countries/al'
import { at } from './countries/at'
import { be } from './countries/be'
import { ch } from './countries/ch'
import { cz } from './countries/cz'
import { de } from './countries/de'
import { dk } from './countries/dk'
import { eg } from './countries/eg'
import { es } from './countries/es'
import { fr } from './countries/fr'
import { gb } from './countries/gb'
import { hu } from './countries/hu'
import { ir } from './countries/ir'
import { it } from './countries/it'
import { lu } from './countries/lu'
import { nl } from './countries/nl'
import { no } from './countries/no'
import { pl } from './countries/pl'
import { ps } from './countries/ps'
import { pt } from './countries/pt'
import { tn } from './countries/tn'
import { ua } from './countries/ua'
import { va } from './countries/va'

// Fisher–Yates shuffle into a new array (used to scramble the card positions on game start)
// the anthem renderings the app can play. This replaces the old "content
// language" dropdown: the choice is now which rendering you hear.
// 🎤 vocal and 🎼 notes are beta: their recordings and melodies are still being
// worked on, so they show while developing but are hidden from production.
export type MusicType = 'instrument' | 'vocal' | 'choral' | 'notes' | 'intro' | 'introInstrument'
const MUSIC_TYPE_DEFS: { type: MusicType, icon: string, key: string, beta?: boolean }[] = [
	{ type: 'instrument', icon: '🎺', key: 'music.instrument' },
	{ type: 'vocal', icon: '🎤', key: 'music.vocal', beta: true },
	{ type: 'choral', icon: '👥', key: 'music.choral', beta: true },
	{ type: 'notes', icon: '🎼', key: 'music.notes' },
	{ type: 'intro', icon: '🥁', key: 'music.intro' },
	{ type: 'introInstrument', icon: '🥁🎺', key: 'music.introInstrument' },
]
const MUSIC_TYPES = MUSIC_TYPE_DEFS.filter(isVisible)

// availability by rendering: 🥁 intro needs the anthem to actually have one
// (`anthem.intro` seconds), 🎤 vocal needs its own recording and 🎼 notes a
// written-out melody. 🎺 instrument and 🥁🎺 intro+instrument always work — with
// no intro the window simply starts at 0, so 🥁🎺 is the whole recording either
// way.
function hasType(c: Country, type: MusicType): boolean {
	if (type === 'intro') return !!c.anthem.intro
	if (type === 'vocal') return !!c.anthem.hasVocal
	if (type === 'choral') return !!c.anthem.hasChoral
	if (type === 'notes') return !!c.anthem.score
	return true
}

// What to play for a country in a given rendering. The three instrumental
// renderings are windows into ONE recording (`/sound/anthem/<code>.aac`):
// 🥁 intro is 0 → intro, 🎺 instrument is intro → end, 🥁🎺 is the whole file.
// 🎤 vocal and 👥 choral are recordings of their own, and 🎼 notes is synthesized live from the
// written melody — no audio file at all.
function clipFor(c: Country, type: MusicType): Clip {
	if (type === 'notes' && c.anthem.score) return { score: c.anthem.score }
	if (type === 'vocal' || type === 'choral') return `/sound/${type}/${c.code}.aac`
	const url = `/sound/anthem/${c.code}.aac`
	const intro = c.anthem.intro ?? 0
	if (type === 'intro') return { url, end: intro }
	if (type === 'instrument') return intro > 0 ? { url, start: intro } : url
	return url // introInstrument: the whole recording
}

/*
 * A rendering as saha writes it, and back. The courtyard's ids are lowercase
 * letters, digits and hyphens — nothing else travels — so `introInstrument`
 * goes as `intro-instrument` and comes home through this app's own list. An
 * id no build recognises resolves to nothing rather than to a rendering
 * somebody else made up.
 */
const sahaSound = (type: MusicType): string => type.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)
const musicOf = (id: string | null): MusicType | null =>
	MUSIC_TYPES.find(m => sahaSound(m.type) === id)?.type ?? null

/*
 * The room a link may have brought this child to. Read once, at load, because
 * joining cleans `?room=` out of the address bar — a value re-derived during a
 * render would disappear the moment the room was entered, taking the lobby's
 * own panel with it.
 */
const INVITED_TO = new URLSearchParams(window.location.search).get('room') ?? undefined

function App() {
	// everything the build supports (after the beta feature flag)
	const ALL_COUNTRIES: Country[] = [sy, iq, lb, ae, om, us, th, tr, gr, se, al, at, be, ch, cz, de, dk, eg, es, fr, gb, hu, ir, it, lu, nl, no, pl, ps, pt, tn, ua, va].filter(isVisible)

	// true while flight-mode downloads are in progress, to show it on the toggle
	const [caching, setCaching] = useState(false)
	// how many sound files are currently in the cache, shown in settings
	const [cachedCount, setCachedCount] = useState(0)

	const refreshCacheCount = useCallback(async () => {
		try {
			setCachedCount(await idbCount())
		} catch {
			// leave the previous count
		}
	}, [])
	// the selected sound: which rendering of the anthem plays. Declared above the
	// settings effect, which sets it from a ?s= parameter.
	const [musicType, setMusicType] = useState<MusicType>('instrument')

	useEffect(() => {
		refreshCacheCount()
	}, [refreshCacheCount])

	// playback, mute and the feedback sounds
	const audio = useAudio(refreshCacheCount)

	// user settings (theme + interface language + display mode + which countries to show)
	const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
	useEffect(() => {
		let loaded = loadSettings()

		// URL parameters for a shareable deep link — see the README. Anything
		// unusable is ignored rather than applied, so a mistyped code cannot leave
		// the app blank.
		// Anthem's sound is the anthem rendering, and unlike its siblings it is a
		// single choice with nothing to hide — so ?s takes one value, not a set.
		const url = readUrlParams(window.location.search, {
			items: ALL_COUNTRIES.map(c => c.code),
			sounds: MUSIC_TYPES.map(m => m.type),
			uiLanguages: UI_LANGUAGES.map(l => l.code),
		})
		if (url.items) {
			loaded = { ...loaded, hiddenCountries: hiddenFrom(ALL_COUNTRIES.map(c => c.code), url.items) }
		}
		if (url.sounds) setMusicType(url.sounds[0] as MusicType)
		if (url.uiLanguage) loaded = { ...loaded, uiLanguage: url.uiLanguage as typeof loaded.uiLanguage }
		if (url.theme) loaded = { ...loaded, theme: url.theme }

		setSettings(loaded)
		applyTheme(loaded.theme)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// the last clicked country's name, shown in the display segment
	const [shownName, setShownName] = useState('')

	// delete only the downloaded sound files (settings stay); not allowed in flight mode
	const clearSoundCache = useCallback(async () => {
		try {
			await idbClear()
		} catch {
			// ignore
		}
		setCachedCount(0)
	}, [])

	// Flight mode: download the given sounds into the cache, showing the busy state.
	const cacheAudioUrls = useCallback(async (audioUrls: string[]) => {
		setCaching(true)
		try {
			await ensureCached(audioUrls)
		} finally {
			setCaching(false)
			refreshCacheCount()
		}
	}, [refreshCacheCount])

	const updateSettings = (next: Settings) => {
		// stop playback when its country just got hidden — otherwise the sound
		// would keep playing with no card left to stop it
		if (audio.playingCode && next.hiddenCountries.includes(audio.playingCode)) {
			audio.stopSound()
		}

		// flight mode: cache every available recording of every visible country.
		// The instrumental renderings share one file, so de-duplicate the urls.
		const visible = ALL_COUNTRIES.filter(c => !next.hiddenCountries.includes(c.code))
		// (a synthesized score has no file, so clipUrl gives null for it)
		const urlsFor = (countries: typeof visible) => [...new Set(
			countries.flatMap(c => MUSIC_TYPES
				.filter(m => hasType(c, m.type))
				.map(m => clipUrl(clipFor(c, m.type)))
				.filter((u): u is string => u !== null)))]
		if (next.flightMode && !settings.flightMode) {
			// just switched on: cache everything currently visible
			cacheAudioUrls(urlsFor(visible))
		} else if (next.flightMode) {
			// already on: cache only the countries that just became visible
			const fresh = visible.filter(c => settings.hiddenCountries.includes(c.code))
			if (fresh.length > 0) {
				cacheAudioUrls(urlsFor(fresh))
			}
		}

		setSettings(next)
		saveSettings(next)
		applyTheme(next.theme)
	}

	const setDisplayMode = (mode: DisplayMode) => updateSettings({ ...settings, displayMode: mode })
	const setUiLanguage = (code: string) => updateSettings({ ...settings, uiLanguage: code as Language })
	// picking 🎲 freezes a fresh order covering every country, so a card keeps its
	// slot when hidden and shown again
	const setSort = (mode: SortMode) => (mode === 'random'
		? updateSettings({ ...settings, sortMode: mode, randomOrder: shuffle(ALL_COUNTRIES.map(c => c.code)) })
		: updateSettings({ ...settings, sortMode: mode }))

	// the visible countries, in a stable order (by code); hidden ones are dropped.
	// All visible countries stay on the board — those without the selected anthem
	// type are shown disabled rather than removed. Sorted first, then filtered, so
	// a hidden country still holds its slot in the order when shown again.
	const COUNTRIES = sortByCodeOrName(ALL_COUNTRIES, {
		mode: settings.sortMode,
		randomOrder: settings.randomOrder,
		// Anthem's names are keyed by interface language, and its sound is a
		// rendering rather than a language — so the name sort follows the UI
		nameOf: c => c.name[settings.uiLanguage],
		locale: settings.uiLanguage,
	}).filter(c => !settings.hiddenCountries.includes(c.code))
	// only countries that actually have the selected rendering can be played/guessed
	const PLAYABLE = COUNTRIES.filter(c => hasType(c, musicType))

	// the anthem sound file(s) of a country in the selected rendering (an array
	// when it's a general-intro-then-instrument sequence)
	// what to play for a country in the selected rendering
	const anthemClip = (c: Country) => clipFor(c, musicType)
	const byCode = (code: string) => ALL_COUNTRIES.find(c => c.code === code)

	// the game: recognise the country from its anthem — the cards shuffle each round
	// (only the countries that have the selected rendering take part)
	// tell sada when the languages change — gated and silent, see @sawt/game
	useSadaSettings('anthem', settings.uiLanguage, musicType)

	const game = useGame<Country, Clip>({
		canPlay: PLAYABLE.length > 0,
		// the round length deals the hand: a fresh shuffle, cut to size (0 = all)
		buildBoard: () => shuffle(PLAYABLE).slice(0, settings.roundLength || PLAYABLE.length),
		roundSize: settings.roundLength,
		promptUrl: c => anthemClip(c),
		// a clip may be a window into a file shared with other renderings, or a
		// score with no file at all — clipUrl returns null for those
		urlsOf: clip => {
			const url = clipUrl(clip)
			return url ? [url] : []
		},
		preload: async urls => {
			await ensureCached(urls)
			refreshCacheCount()
		},
		audio,
		// a round is labelled by the anthem type it was played in
		mode: musicType,
		app: 'anthem',
		onRoundStart: () => setShownName(''),
	})

	/*
	 * The courtyard: the same anthems, but the board, the order and every
	 * verdict come from saha, so that two children — each hearing their own
	 * rendering — race the very same round. It sits beside the solo game rather
	 * than inside it; whichever one is on decides what the cards do.
	 */
	const race = useRace<Clip>({
		app: 'anthem',
		// only what this child can actually hear right now
		playable: () => PLAYABLE.map(c => c.code),
		// a room opens with this child's round length, and keeps it for rematches
		roundSize: settings.roundLength,
		// the clip of a dealt code, in the room's rendering when it holds one
		promptUrl: (code, sound) => {
			const country = byCode(code)
			return country ? clipFor(country, musicOf(sound ?? null) ?? musicType) : ''
		},
		urlsOf: clip => {
			const url = clipUrl(clip)
			return url ? [url] : []
		},
		preload: async urls => {
			await ensureCached(urls)
			refreshCacheCount()
		},
		audio,
		// the same label the solo round carries, posted as `race:<rendering>`
		mode: musicType,
		// the rendering this child is set to — what a host may hold a room to
		sound: sahaSound(musicType),
		onRoundStart: () => setShownName(''),
	})
	// a round is on and the cards belong to it
	const racing = race.on && race.phase !== 'lobby' && race.phase !== 'connecting'

	/*
	 * The rendering actually being played: this child's, unless the room is
	 * being held to the host's. Unlike the other apps nothing on screen has to
	 * follow it — a card is a flag or a name, and the display stays blank
	 * during a round either way — so this is only ever about what comes out of
	 * the speaker.
	 */
	const heard = musicOf(race.sound) ?? musicType

	const board = racing
		? race.board.map(byCode).filter((c): c is Country => c !== undefined)
		: (game.gameOn ? game.board : COUNTRIES)

	// what a card is, right now: solo game, race, or just an anthem to hear
	const solved = racing ? race.done : game.solved
	const wrongs = racing ? race.wrong : game.wrongGuesses
	const feedback = racing ? race.feedback : game.feedback
	// the display segment shows the last clicked country's name; during a round —
	// alone or in a courtyard — it stays blank so the anthem doesn't give the
	// country away
	const displayText = (game.gameOn || racing) ? '' : shownName

	// UI-string translator, following the interface language chosen in settings
	const t = translator(settings.uiLanguage)
	// lay the cards right-to-left when the interface language is Arabic
	const boardDir = settings.uiLanguage === 'ar' ? 'rtl' : 'ltr'

	// what a card shows: the flag emoji, or the country name in the UI language
	const cardFace = (c: Country) =>
		settings.displayMode === 'flag' ? c.flag : c.name[settings.uiLanguage]

	// a link that reproduces what is on screen. `s` carries the rendering rather
	// than a language, and it is one choice with nothing to hide — so it is always
	// a single value here
	const shareUrl = () => window.location.origin + window.location.pathname + writeUrlParams({
		items: { all: ALL_COUNTRIES.map(c => c.code), visible: COUNTRIES.map(c => c.code) },
		sounds: { all: MUSIC_TYPES.map(m => m.type), visible: [musicType] },
		uiLanguage: settings.uiLanguage,
		theme: settings.theme,
	})

	// a link that brings a friend straight into this room
	const { status: copyStatus, copy } = useCopyLink()
	const inviteUrl = (roomCode: string) =>
		window.location.origin + window.location.pathname + `?room=${roomCode}`

	/*
	 * 🏟️ and its sheet, at the head of the game actions. It is built here and
	 * handed to whichever cluster is on screen so the button keeps its place
	 * (and its open sheet) when a solo round becomes a shared one.
	 */
	const courtyard = (
		<RacePanel
			race={race}
			t={t}
			inviteUrl={inviteUrl}
			initialCode={INVITED_TO}
			onCopyInvite={url => void copy(url)}
			copyIcon={COPY_ICON[copyStatus]}
			/*
			 * A room's rendering, named the way the dropdown names it — 🎺 with
			 * its word — and only ever from this app's own list, so an id from a
			 * build that knows a rendering this one does not resolves to nothing
			 * rather than to a word nobody vouched for.
			 */
			soundName={id => {
				const found = MUSIC_TYPES.find(m => m.type === musicOf(id))
				return found ? `${found.icon} ${t(found.key)}` : ''
			}}
		/>
	)

	// shrink the display font before falling back to the marquee
	const displayRef = useFitText(displayText)

	return (
		<div className="Anthem">
			{/* the app bar's four segments sit right-to-left: toolbar, display,
			    game score, game actions (the last two only in game mode) */}
			<header className="app-bar">
				<div className="toolbar">
					<button
						className={(game.gameOn ? 'game-toggle on' : 'game-toggle') + (game.preparing ? ' busy' : '')}
						aria-label={game.gameOn ? t('game.end') : t('game.start')}
						aria-pressed={game.gameOn}
						title={
							game.gameOn
								? t('game.end')
								: (game.canPlay ? t('game.start') : t('game.selectToPlay'))
						}
						disabled={(!game.gameOn && !game.canPlay) || game.preparing}
						onClick={() => {
							// the courtyard lives inside game mode, so it closes with it
							if (race.on) race.leave()
							if (game.gameOn) game.exitGame()
							else game.enterGame()
						}}
					>
						🕹️
					</button>
					{/*
					  * A child who arrived on a friend's link has not pressed 🕹️
					  * and would otherwise find no way in, so the invitation
					  * brings its own door. Everyone else reaches a courtyard
					  * the way they reach a round: 🕹️ first, then 🏟️.
					  */}
					{INVITED_TO && !game.gameOn && !racing && courtyard}
					<ResultsPeek results={game.results}/>
					<button
						className={audio.muted ? 'mute-toggle on' : 'mute-toggle'}
						aria-label={audio.muted ? t('mute.unmute') : t('mute.mute')}
						aria-pressed={audio.muted}
						title={audio.muted ? t('mute.unmuteTitle') : t('mute.muteTitle')}
						onClick={audio.toggleMute}
					>
						{audio.muted ? '🔇' : '🔊'}
					</button>
					<select
						className="language-select"
						title={t('music.title')}
						aria-label={t('music.title')}
						value={musicType}
						disabled={game.target !== null || race.on}
						onChange={(e) => {
							setMusicType(e.target.value as MusicType)
							setShownName('')
							audio.stopSound()
						}}
					>
						{MUSIC_TYPES.map(m => (
							<option key={`music-${m.type}`} value={m.type}>{m.icon} {t(m.key)}</option>
						))}
					</select>
					<SettingsPanel
						settings={settings}
						shareUrl={shareUrl}
						countries={ALL_COUNTRIES.map(c => ({ code: c.code, flag: c.flag }))}
						caching={caching}
						cachedCount={cachedCount}
						locked={game.gameOn || race.on}
						/*
						 * In a courtyard the round length is the room's: it was
						 * settled when the room was opened and a rematch keeps it,
						 * so the buttons stay put rather than promising a change
						 * that would never arrive.
						 */
						roundRunning={game.target !== null || race.on}
						t={t}
						uiLanguage={settings.uiLanguage}
						uiLanguages={UI_LANGUAGES}
						onSetUiLanguage={setUiLanguage}
						onSetDisplayMode={setDisplayMode}
						onSetSort={setSort}
						onChange={updateSettings}
						onClearCache={clearSoundCache}
					/>
				</div>
				<div className="display">
					<h1 className="display-text" ref={displayRef}>
						{game.preparing ? '⏳' : displayText}
					</h1>
				</div>
				{racing && <RaceScore race={race} t={t}/>}
				{game.gameOn && !racing && (
					<GameScore
						t={t}
						played={game.solved.length}
						total={game.total}
						mistakes={game.mistakes}
						giveUps={game.giveUps}
						ms={game.elapsedMs}
					/>
				)}
				{/*
				  * In a courtyard the cluster loses its ⏹️/▶️: starting is the
				  * host's word, given in the 🏟️ panel, and stopping would mean
				  * stopping everyone's round. 🤷‍♂️ becomes a vote for the same
				  * reason.
				  */}
				{racing && (
					<GameActions
						t={t}
						lead={courtyard}
						roundActive={race.target !== null}
						muted={audio.muted}
						preparing={false}
						onReplay={() => {
							const country = race.target ? byCode(race.target) : undefined
							if (country) audio.play(clipFor(country, heard))
						}}
						onGiveUp={race.skip}
					/>
				)}
				{game.gameOn && !racing && (
					<GameActions
						t={t}
						lead={courtyard}
						roundActive={game.target !== null}
						muted={audio.muted}
						preparing={game.preparing}
						onReplay={game.replay}
						onGiveUp={game.giveUp}
						onSweep={game.sweepSolved}
						sweepReady={game.solved.length > 0}
						onToggleRound={game.toggleRound}
					/>
				)}
			</header>
			<hgroup dir={boardDir}>
				{board.map(c => {
					/*
					 * A solo round's 🤷‍♂️ is the solo round's alone: it outlives the
					 * round that made it (nothing clears it until the next one
					 * starts), so without this guard a child who gave up on Greece
					 * and then opened a courtyard would find Greece greyed out —
					 * and unwinnable when the room asked for it. A courtyard's
					 * given-up cards arrive with the board instead.
					 */
					const isGivenUp = !racing && game.gameOn && game.gaveUpCodes.includes(c.code)
					const isSolved = (racing || game.gameOn) && solved.includes(c.code) && !isGivenUp
					const isWrong = (racing || game.gameOn) && wrongs.includes(c.code)
					/*
					 * This country has no audio for the selected rendering: shown,
					 * but disabled. Never in a courtyard, where the board was dealt
					 * from what everyone in the room can hear — the server has
					 * already had this thought, and a card it dealt must stay
					 * tappable.
					 */
					const unavailable = !racing && !hasType(c, musicType)
					return (
						<button
							key={`country-${c.code}`}
							className={'button-flag'
								+ (settings.displayMode === 'name' ? ' as-name' : '')
								+ (audio.playingCode === c.code ? ' playing' : '')
								+ (isWrong ? ' wrong' : '')}
							title={(game.gameOn || racing) ? '' : c.name[settings.uiLanguage]}
							disabled={isSolved || isGivenUp || isWrong || unavailable}
							onClick={() => {
								if (racing) {
									race.tap(c.code)
								} else if (game.gameOn) {
									game.guess(c.code)
								} else if (audio.playingCode === c.code) {
									audio.stopSound()
								} else {
									audio.play(anthemClip(c), c.code)
									setShownName(c.name[settings.uiLanguage])
								}
							}}
						>
							<span className={'card-face' + (settings.displayMode === 'flag' ? ' flag-emoji' : '')}>{cardFace(c)}</span>
							{audio.playingCode === c.code && <span className="play-icon">▶</span>}
							{/*
							  * A settled card wears its winner: 👍 at the top right, the
							  * animal of whoever got there first at the top left. In a
							  * courtyard a card can also settle with nobody winning it —
							  * the room voted it away, or it timed out — and that one
							  * gets 🤷‍♂️ and no animal, the same as giving up alone.
							  */}
							{isSolved && racing && race.wonBy(c.code) && (
								<span className="swatch-winner">{race.wonBy(c.code)}</span>
							)}
							{isSolved && (
								<span className="swatch-mark">
									{racing && !race.wonBy(c.code) ? '🤷‍♂️' : '👍'}
								</span>
							)}
							{isGivenUp && <span className="swatch-mark">🤷‍♂️</span>}
							{isWrong && <span className="swatch-mark">👎</span>}
						</button>
					)
				})}
			</hgroup>
			{feedback && (
				<div key={feedback.id} className="game-feedback" aria-hidden="true">
					{feedback.emoji}
				</div>
			)}
			<Analytics/>
		</div>
	)
}

export default App
