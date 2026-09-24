import './App.css'

import { useCallback, useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'

import { isVisible } from '@sawt/feature-flags'
import { shuffle, sortByCodeOrName } from '@sawt/order'
import { readUrlParams, writeUrlParams, hiddenFrom } from '@sawt/url-state'
import { useGame, useRace, useSadaSettings } from '@sawt/game'
import { useCopyLink, COPY_ICON, useFitText } from '@sawt/ui'

import SettingsPanel from './SettingsPanel'
import { GameScore, GameActions, ResultsPeek, RaceScore, RacePanel } from './GameHud'
import { Dino, Language } from './dinos/Dino'
import {
	Settings,
	SortMode,
	DEFAULT_SETTINGS,
	loadSettings,
	saveSettings,
	applyTheme,
	preferredSound,
} from './settingsStore'
import { ensureCached, idbCount, idbClear, getAudioBlob } from './audioCache'
import { useAudio } from './useAudio'
import { translator, languageName, UI_LANGUAGES, UiLanguage } from './i18n'
import { stegosaurus } from './dinos/stegosaurus'
import { triceratops } from './dinos/triceratops'
import { tyrannosaurus } from './dinos/tyrannosaurus'

// a dinosaur's picture: hand-drawn SVG, one per animal (see public/dino/)
const drawingUrl = (code: string) => `/dino/${code}.svg`

/*
 * The room a link may have brought this child to. Read once, at load, because
 * joining cleans `?room=` out of the address bar — a value re-derived during a
 * render would disappear the moment the room was entered, taking the lobby's
 * own panel with it.
 */
const INVITED_TO = new URLSearchParams(window.location.search).get('room') ?? undefined

function App() {
	// everything the build supports (after the beta feature flag)
	const ALL_DINOS: Dino[] = [tyrannosaurus, stegosaurus, triceratops].filter(isVisible)
	const LANGUAGE_DEFS: { code: Language, display: string, beta?: boolean }[] = [
		{ code: 'en', display: 'English' },
		{ code: 'de', display: 'Deutsch' },
	]
	const ALL_LANGUAGES = LANGUAGE_DEFS.filter(isVisible)

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
	// the selected sound: the language the dinosaur's name is spoken in. Declared
	// above the settings effect, which sets it from a ?s= parameter.
	const [lang, setLang] = useState<Language>(() => preferredSound())

	useEffect(() => {
		refreshCacheCount()
	}, [refreshCacheCount])

	// playback, mute and the feedback sounds
	const audio = useAudio(refreshCacheCount)

	/*
	 * The drawings ride the same cache as the sounds, the way Verb caches its
	 * animations: the first visit stores them and from then on the <img>s read
	 * object URLs of the cached blobs, so ✈️ takes the pictures offline along
	 * with the words. Until a blob arrives the <img> falls back to the network
	 * path, which is why a card is never blank while this settles.
	 */
	const [drawingSrc, setDrawingSrc] = useState<Record<string, string>>({})
	useEffect(() => {
		let cancelled = false
		const jobs = ALL_DINOS.map(async d => {
			const url = drawingUrl(d.code)
			const blob = await getAudioBlob(url)
			if (!blob) return [d.code, url] as const
			// an SVG blob only renders in an <img> if its type says so
			const svg = blob.type ? blob : new Blob([blob], { type: 'image/svg+xml' })
			return [d.code, URL.createObjectURL(svg)] as const
		})
		Promise.all(jobs).then(entries => {
			if (cancelled) return
			setDrawingSrc(Object.fromEntries(entries))
			refreshCacheCount()
		})
		return () => {
			cancelled = true
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// user settings (theme + which languages/dinosaurs to show on the main screen)
	const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
	useEffect(() => {
		let loaded = loadSettings()

		// URL parameters for a shareable deep link — see the README. Anything
		// unusable is ignored rather than applied, so a mistyped code cannot leave
		// the app blank.
		const url = readUrlParams(window.location.search, {
			items: ALL_DINOS.map(d => d.code),
			sounds: ALL_LANGUAGES.map(l => l.code),
			uiLanguages: UI_LANGUAGES.map(l => l.code),
		})
		if (url.items) {
			loaded = { ...loaded, hiddenDinos: hiddenFrom(ALL_DINOS.map(d => d.code), url.items) }
		}
		if (url.sounds) {
			loaded = { ...loaded, hiddenLanguages: hiddenFrom(ALL_LANGUAGES.map(l => l.code), url.sounds) as Language[] }
			setLang(url.sounds[0] as Language) // first listed = selected
		}
		if (url.uiLanguage) loaded = { ...loaded, uiLanguage: url.uiLanguage as typeof loaded.uiLanguage }
		if (url.theme) loaded = { ...loaded, theme: url.theme }

		setSettings(loaded)
		applyTheme(loaded.theme)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const [name, setName] = useState('')

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
		// stop playback when its dinosaur, or the selected language, just got hidden —
		// otherwise the sound would keep playing with no button left to stop it
		if (
			(audio.playingCode && next.hiddenDinos.includes(audio.playingCode)) ||
			next.hiddenLanguages.includes(lang)
		) {
			audio.stopSound()
		}

		// flight mode: download what is (or becomes) visible
		const visibleLangs = ALL_LANGUAGES.filter(l => !next.hiddenLanguages.includes(l.code))
		const visibleDinos = ALL_DINOS.filter(d => !next.hiddenDinos.includes(d.code))
		const urlsFor = (langs: typeof visibleLangs, dinos: typeof visibleDinos) =>
			langs.flatMap(l => dinos.map(d => `/sound/lang/${l.code}/${d.code}.aac`))
		// the pictures go with the words: ✈️ that left the drawings behind would
		// fly a board of blank cards
		const drawingsFor = (dinos: typeof visibleDinos) => dinos.map(d => drawingUrl(d.code))
		if (next.flightMode && !settings.flightMode) {
			// just switched on: cache everything currently visible
			cacheAudioUrls([...urlsFor(visibleLangs, visibleDinos), ...drawingsFor(visibleDinos)])
		} else if (next.flightMode) {
			// already on: cache only what just became visible
			const newLangs = visibleLangs.filter(l => settings.hiddenLanguages.includes(l.code))
			const newDinos = visibleDinos.filter(d => settings.hiddenDinos.includes(d.code))
			const oldLangs = visibleLangs.filter(l => !settings.hiddenLanguages.includes(l.code))
			const urls = [
				...urlsFor(newLangs, visibleDinos),
				...urlsFor(oldLangs, newDinos),
				...drawingsFor(newDinos),
			]
			if (urls.length > 0) {
				cacheAudioUrls(urls)
			}
		}

		setSettings(next)
		saveSettings(next)
		applyTheme(next.theme)
	}

	// choose a sort mode for the cards; choosing random reshuffles every time
	const setSort = (mode: SortMode) => {
		if (mode === 'random') {
			updateSettings({ ...settings, sortMode: 'random', randomOrder: shuffle(ALL_DINOS.map(d => d.code)) })
		} else {
			updateSettings({ ...settings, sortMode: mode })
		}
	}

	const LANGUAGES = ALL_LANGUAGES.filter(l => !settings.hiddenLanguages.includes(l.code))
	// what the main screen actually shows: all dinosaurs sorted by the chosen mode,
	// then filtered to the visible ones (hidden cards still hold their sorted slot)
	const DINOS = sortByCodeOrName(ALL_DINOS, {
		mode: settings.sortMode,
		randomOrder: settings.randomOrder,
		// no visible language means there is no name to sort by — fall back to code
		nameOf: LANGUAGES.length > 0 ? d => d.name[lang] : undefined,
		locale: lang,
	})
		.filter(d => !settings.hiddenDinos.includes(d.code))

	// if the selected language gets hidden in settings, fall back to the first visible one
	useEffect(() => {
		if (LANGUAGES.length > 0 && !LANGUAGES.some(l => l.code === lang)) {
			setLang(LANGUAGES[0].code)
			setName('')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings.hiddenLanguages])

	/*
	 * The sound file of a dinosaur's name. In the selected language by default —
	 * and in a given one when asked, which is what a courtyard held to the
	 * host's language needs: the same board, spoken in a language this child
	 * did not choose.
	 */
	const soundUrl = (code: string, sound: string = lang) => `/sound/lang/${sound}/${code}.aac`

	// the game: the cards shuffle on every round — only the prompts are random too
	// tell sada when the languages change — gated and silent, see @sawt/game
	useSadaSettings('dino', settings.uiLanguage, lang)

	const game = useGame<Dino>({
		canPlay: LANGUAGES.length > 0 && DINOS.length > 0,
		buildBoard: () => shuffle(DINOS),
		promptUrl: d => soundUrl(d.code),
		preload: async urls => {
			await ensureCached(urls)
			refreshCacheCount()
		},
		audio,
		// a round is labelled by the language it was played in
		mode: lang,
		app: 'dino',
		// a ?room= link opens the app in game mode, so 🏟️ sits where it
		// always does — at the head of the round buttons
		enterOnMount: Boolean(INVITED_TO),
		onRoundStart: () => setName(''),
	})

	/*
	 * The courtyard: the same dinosaurs, but the board, the order and every verdict
	 * come from saha, so that two children — each hearing their own language —
	 * race the very same round. It sits beside the solo game rather than inside
	 * it; whichever one is on decides what the cards do.
	 */
	const race = useRace({
		app: 'dino',
		// only what this child can actually hear right now
		playable: () => DINOS.map(d => d.code),
		promptUrl: soundUrl,
		preload: async urls => {
			await ensureCached(urls)
			refreshCacheCount()
		},
		audio,
		// the same label the solo round carries, posted as `race:<language>`
		mode: lang,
		// the language this child is set to — what a host may hold a room to
		sound: lang,
		onRoundStart: () => setName(''),
	})
	// a round is on and the cards belong to it
	const racing = race.on && race.phase !== 'lobby' && race.phase !== 'connecting'
	const byCode = (code: string) => ALL_DINOS.find(d => d.code === code)

	/*
	 * The language actually being spoken: this child's, unless the room is
	 * being held to the host's. Both the audio and the *name on the display*
	 * follow it — a race heard in Arabic whose display reads "Ledsen" would
	 * hand every answer to the child who can read.
	 *
	 * A room held to a language this build does not have (an older or newer
	 * app across the courtyard) falls back to this child's own rather than
	 * fetching a URL nobody has: they hear their own language and can still
	 * play, which is the same graceful degrade the rest of saha uses.
	 */
	const known = (sound: string | null): Language | null =>
		ALL_LANGUAGES.some(l => l.code === sound) ? sound as Language : null
	const heard = known(race.sound) ?? lang

	const board = racing
		? race.board.map(byCode).filter((d): d is Dino => d !== undefined)
		: (game.gameOn ? game.board : DINOS)

	// what a card is, right now: solo game, race, or just a name to hear
	const solved = racing ? race.done : game.solved
	const wrongs = racing ? race.wrong : game.wrongGuesses
	const currentTarget = racing ? race.target : game.target
	const feedback = racing ? race.feedback : game.feedback
	// what the display segment shows: the prompted name during a round (so the
	// game is playable while muted), otherwise the last clicked name. In a
	// courtyard it is the name in the language being spoken, which is not
	// always this child's own
	const displayText = currentTarget !== null && (game.gameOn || racing)
		? (byCode(currentTarget)?.name[racing ? heard : lang] ?? '')
		: name

	// UI-string translator, following the interface language chosen in settings
	// (independent of the content/dinosaur-name language; falls back to English)
	const t = translator(settings.uiLanguage)
	const setUiLanguage = (code: string) => updateSettings({ ...settings, uiLanguage: code as UiLanguage })

	// content languages as { code, display } with names in the UI language,
	// sorted alphabetically by that display name (using the UI language's collation)
	const localizedContent = (list: { code: Language, display: string }[]) => list
		.map(l => ({ code: l.code, display: languageName(t, l.code, l.display) }))
		.sort((a, b) => a.display.localeCompare(b.display, settings.uiLanguage))

	// a link that reproduces what is on screen: the visible dinosaurs, the visible
	// languages with the selected one first, the interface language and the theme
	const shareUrl = () => window.location.origin + window.location.pathname + writeUrlParams({
		items: { all: ALL_DINOS.map(d => d.code), visible: DINOS.map(d => d.code) },
		sounds: {
			all: ALL_LANGUAGES.map(l => l.code),
			visible: [lang, ...LANGUAGES.map(l => l.code).filter(c => c !== lang)],
		},
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
			roundOn={game.roundOn}
			inviteUrl={inviteUrl}
			initialCode={INVITED_TO}
			onCopyInvite={url => void copy(url)}
			copyIcon={COPY_ICON[copyStatus]}
			/*
			 * A room's language, named in this child's own interface language —
			 * and only ever from this app's own list, so an id from a build that
			 * knows a language this one does not resolves to nothing rather than
			 * to a word nobody vouched for.
			 */
			soundName={id => {
				const found = ALL_LANGUAGES.find(l => l.code === id)
				return found ? languageName(t, found.code, found.display) : ''
			}}
		/>
	)

	// shrink the display font before falling back to the marquee
	const displayRef = useFitText(displayText)

	return (
		<div className="Dino">
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
						title={t('lang.title')}
						value={lang}
						disabled={game.roundOn || race.roundOn}
						onChange={(e) => {
							setLang(e.target.value as Language)
							setName('')
							audio.stopSound()
						}}
					>
						{localizedContent(LANGUAGES).map(l => (
							<option key={`lang-${l.code}`} value={l.code}>{l.display}</option>
						))}
					</select>
					<SettingsPanel
						settings={settings}
						shareUrl={shareUrl}
						languages={localizedContent(ALL_LANGUAGES)}
						dinos={ALL_DINOS.map(d => ({ code: d.code, src: drawingSrc[d.code] ?? drawingUrl(d.code) }))}
						caching={caching}
						cachedCount={cachedCount}
						locked={game.roundOn || race.on}
						t={t}
						uiLanguage={settings.uiLanguage}
						uiLanguages={UI_LANGUAGES}
						onSetUiLanguage={setUiLanguage}
						onChange={updateSettings}
						onSetSort={setSort}
						onClearCache={clearSoundCache}
					/>
				</div>
				<div className="display">
					<h1 className="display-text" ref={displayRef}>
						{game.preparing ? '⏳' : displayText}
					</h1>
				</div>
				{race.on && <RaceScore race={race} t={t}/>}
				{game.gameOn && !race.on && (
					<GameScore
						t={t}
						played={game.solved.length}
						total={game.board.length}
						mistakes={game.mistakes}
						giveUps={game.giveUps}
						ms={game.elapsedMs}
					/>
				)}
				{/*
				  * One cluster, whichever round is on — never two conditional
				  * siblings. The courtyard sits inside `lead`, and React gives a
				  * child of a different parent fresh state: with a room cluster
				  * and a solo cluster taking turns, 🚪 remounted the courtyard and
				  * a child who had arrived by link found the join sheet back, the
				  * link's digits filled in. In a room nothing leaves the bar:
				  * 🤷‍♂️ becomes a vote, ▶️ is the host's alone and ⏹️ is
				  * nobody's, both drawn disabled rather than removed.
				  */}
				{(game.gameOn || race.on) && (
					<GameActions
						t={t}
						lead={courtyard}
						{...(race.on ? {
							roundActive: race.target !== null,
							muted: audio.muted,
							preparing: false,
							/*
							 * ▶️ is the host's; a guest sees it disabled rather than
							 * gone. ⏹️ is nobody's in a room — stopping would stop
							 * everyone's round — so it stays on screen, disabled.
							 */
							onStart: race.canStart ? race.start : undefined,
							onStop: undefined,
							// 🧹 still means something here: it sweeps this child's
							// view of the shared board, which saha ordered for everyone
							onSweep: race.sweep,
							sweepReady: race.canSweep,
							onReplay: () => race.target && audio.play(soundUrl(race.target, heard)),
							onGiveUp: race.skip,
						} : {
							roundActive: game.target !== null,
							muted: audio.muted,
							preparing: game.preparing,
							onReplay: game.replay,
							onGiveUp: game.giveUp,
							onSweep: game.sweepSolved,
							sweepReady: game.solved.length > 0,
							onStart: game.startRound,
							onStop: game.stopRound,
						})}
					/>
				)}
			</header>
			<hgroup>
				{board.map(d => {
					/*
					 * A solo round's 🤷‍♂️ is the solo round's alone: it outlives the
					 * round that made it (nothing clears it until the next one
					 * starts), so without this guard a child who gave up on the
					 * stegosaurus and then opened a courtyard would find it greyed
					 * out — and unwinnable when the room asked for it. A courtyard's
					 * given-up cards arrive with the board instead.
					 */
					const isGivenUp = !racing && game.gameOn && game.gaveUpCodes.includes(d.code)
					const isSolved = (racing || game.gameOn) && solved.includes(d.code) && !isGivenUp
					const isWrong = (racing || game.gameOn) && wrongs.includes(d.code)
					return (
						<button
							key={`dino-${d.code}`}
							className={'button-dino' + (audio.playingCode === d.code ? ' playing' : '') + (isWrong ? ' wrong' : '')}
							title={(game.gameOn || racing) ? '' : (LANGUAGES.length > 0 ? d.name[lang] : '🤷‍♂️')}
							disabled={isSolved || isGivenUp || isWrong}
							onClick={() => {
								if (racing) {
									race.tap(d.code)
								} else if (game.gameOn) {
									game.guess(d.code)
								} else if (audio.playingCode === d.code) {
									audio.stopSound()
								} else if (LANGUAGES.length === 0) {
									// every language is hidden: nothing to say
									setName('🤷‍♂️')
								} else {
									setName(d.name[lang])
									audio.play(soundUrl(d.code), d.code)
								}
							}}
						>
							<img
								className="dino-drawing"
								src={drawingSrc[d.code] ?? drawingUrl(d.code)}
								alt=""
								draggable={false}
							/>
							{audio.playingCode === d.code && <span className="play-icon">▶</span>}
							{/*
							  * A settled card wears its winner: 👍 at the top right, the
							  * animal of whoever got there first at the top left. In a
							  * courtyard a card can also settle with nobody winning it —
							  * the room voted it away, or it timed out — and that one
							  * gets 🤷‍♂️ and no animal, the same as giving up alone.
							  */}
							{isSolved && racing && race.wonBy(d.code) && (
								<span className="swatch-winner avatar-glyph">{race.wonBy(d.code)}</span>
							)}
							{isSolved && (
								<span className="swatch-mark">
									{racing && !race.wonBy(d.code) ? '🤷‍♂️' : '👍'}
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
