import './App.css'
import { useCallback, useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import SettingsPanel from './SettingsPanel'
import { GameScore, GameActions } from './GameHud'
import { Country, Language } from './countries/Country'
import { isVisible } from './featureFlags'
import {
	Settings,
	DisplayMode,
	DEFAULT_SETTINGS,
	loadSettings,
	saveSettings,
	applyTheme,
} from './settingsStore'
import { ensureCached, idbCount, idbClear } from './audioCache'
import { useAudio, clipUrl, Clip } from './useAudio'
import { useGame } from './useGame'
import { useFitText } from './useFitText'
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
function shuffle<T>(items: T[]): T[] {
	const out = items.slice()
	for (let i = out.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[out[i], out[j]] = [out[j], out[i]]
	}
	return out
}

// the anthem renderings the app can play. This replaces the old "content
// language" dropdown: the choice is now which rendering you hear.
// 🎤 vocal and 🎼 notes are beta: their recordings and melodies are still being
// worked on, so they show while developing but are hidden from production.
export type MusicType = 'instrument' | 'vocal' | 'notes' | 'intro' | 'introInstrument'
const MUSIC_TYPE_DEFS: { type: MusicType, icon: string, key: string, beta?: boolean }[] = [
	{ type: 'instrument', icon: '🎺', key: 'music.instrument' },
	// 'vocal' means a solo vocalist; choral and other kinds get their own
	// types later, so the id stays generic until that split happens
	{ type: 'vocal', icon: '🎤', key: 'music.vocal', beta: true },
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
	if (type === 'notes') return !!c.anthem.score
	return true
}

// What to play for a country in a given rendering. The three instrumental
// renderings are windows into ONE recording (`/sound/anthem/<code>.aac`):
// 🥁 intro is 0 → intro, 🎺 instrument is intro → end, 🥁🎺 is the whole file.
// 🎤 vocal is a recording of its own, and 🎼 notes is synthesized live from the
// written melody — no audio file at all.
function clipFor(c: Country, type: MusicType): Clip {
	if (type === 'notes' && c.anthem.score) return { score: c.anthem.score }
	if (type === 'vocal') return `/sound/${type}/${c.code}.aac`
	const url = `/sound/anthem/${c.code}.aac`
	const intro = c.anthem.intro ?? 0
	if (type === 'intro') return { url, end: intro }
	if (type === 'instrument') return intro > 0 ? { url, start: intro } : url
	return url // introInstrument: the whole recording
}

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
	useEffect(() => {
		refreshCacheCount()
	}, [refreshCacheCount])

	// playback, mute and the feedback sounds
	const audio = useAudio(refreshCacheCount)

	// user settings (theme + interface language + display mode + which countries to show)
	const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
	useEffect(() => {
		let loaded = loadSettings()

		// URL param for a shareable/deep-linked view:
		//   ?f=sy,iq  -> only these countries are visible
		const params = new URLSearchParams(window.location.search)
		const fParam = params.get('f')
		if (fParam !== null) {
			const want = new Set(fParam.split(',').map(s => s.trim()).filter(Boolean))
			const hiddenCountries = ALL_COUNTRIES.map(c => c.code).filter(c => !want.has(c))
			loaded = { ...loaded, hiddenCountries }
		}

		setSettings(loaded)
		applyTheme(loaded.theme)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// which anthem rendering is played on a card click / as the game prompt
	const [musicType, setMusicType] = useState<MusicType>('instrument')
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

	// the visible countries, in a stable order (by code); hidden ones are dropped.
	// All visible countries stay on the board — those without the selected anthem
	// type are shown disabled rather than removed.
	const COUNTRIES = ALL_COUNTRIES
		.filter(c => !settings.hiddenCountries.includes(c.code))
		.sort((a, b) => a.code.localeCompare(b.code))
	// only countries that actually have the selected rendering can be played/guessed
	const PLAYABLE = COUNTRIES.filter(c => hasType(c, musicType))

	// the anthem sound file(s) of a country in the selected rendering (an array
	// when it's a general-intro-then-instrument sequence)
	// what to play for a country in the selected rendering
	const anthemClip = (c: Country) => clipFor(c, musicType)

	// the game: recognise the country from its anthem — the cards shuffle each round
	// (only the countries that have the selected rendering take part)
	const game = useGame<Country>({
		canPlay: PLAYABLE.length > 0,
		buildBoard: () => shuffle(PLAYABLE),
		promptUrl: c => anthemClip(c),
		preload: async urls => {
			await ensureCached(urls)
			refreshCacheCount()
		},
		audio,
		// a round is labelled by the anthem type it was played in
		mode: musicType,
		onRoundStart: () => setShownName(''),
	})

	const board = game.gameOn ? game.board : COUNTRIES
	// the display segment shows the last clicked country's name; during a round it
	// stays blank so the anthem doesn't give the country away
	const displayText = game.gameOn ? '' : shownName

	// UI-string translator, following the interface language chosen in settings
	const t = translator(settings.uiLanguage)
	// lay the cards right-to-left when the interface language is Arabic
	const boardDir = settings.uiLanguage === 'ar' ? 'rtl' : 'ltr'

	// what a card shows: the flag emoji, or the country name in the UI language
	const cardFace = (c: Country) =>
		settings.displayMode === 'flag' ? c.flag : c.name[settings.uiLanguage]

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
						onClick={() => (game.gameOn ? game.exitGame() : game.startRound())}
					>
						🕹️
					</button>
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
						disabled={game.target !== null}
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
						countries={ALL_COUNTRIES.map(c => ({ code: c.code, flag: c.flag }))}
						caching={caching}
						cachedCount={cachedCount}
						locked={game.gameOn}
						t={t}
						uiLanguage={settings.uiLanguage}
						uiLanguages={UI_LANGUAGES}
						onSetUiLanguage={setUiLanguage}
						onSetDisplayMode={setDisplayMode}
						onChange={updateSettings}
						onClearCache={clearSoundCache}
					/>
				</div>
				<div className="display">
					<h1 className="display-text" ref={displayRef}>
						{game.preparing ? '⏳' : displayText}
					</h1>
				</div>
				{game.gameOn && (
					<GameScore
						t={t}
						played={game.solved.length}
						total={game.board.length}
						mistakes={game.mistakes}
						giveUps={game.giveUps}
						ms={game.elapsedMs}
					/>
				)}
				{game.gameOn && (
					<GameActions
						t={t}
						roundActive={game.target !== null}
						muted={audio.muted}
						preparing={game.preparing}
						onReplay={game.replay}
						onGiveUp={game.giveUp}
						onToggleRound={game.toggleRound}
					/>
				)}
			</header>
			<hgroup dir={boardDir}>
				{board.map(c => {
					const isGivenUp = game.gameOn && game.gaveUpCodes.includes(c.code)
					const isSolved = game.gameOn && game.solved.includes(c.code) && !isGivenUp
					const isWrong = game.gameOn && game.wrongGuesses.includes(c.code)
					// this country has no audio for the selected anthem type: show it,
					// but disabled (not hidden)
					const unavailable = !hasType(c, musicType)
					return (
						<button
							key={`country-${c.code}`}
							className={'button-flag'
								+ (settings.displayMode === 'name' ? ' as-name' : '')
								+ (audio.playingCode === c.code ? ' playing' : '')
								+ (isWrong ? ' wrong' : '')}
							title={game.gameOn ? '' : c.name[settings.uiLanguage]}
							disabled={isSolved || isGivenUp || isWrong || unavailable}
							onClick={() => {
								if (game.gameOn) {
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
							{isSolved && <span className="swatch-mark">👍</span>}
							{isGivenUp && <span className="swatch-mark">🤷‍♂️</span>}
							{isWrong && <span className="swatch-mark">👎</span>}
						</button>
					)
				})}
			</hgroup>
			{game.feedback && (
				<div key={game.feedback.id} className="game-feedback" aria-hidden="true">
					{game.feedback.emoji}
				</div>
			)}
			<Analytics/>
		</div>
	)
}

export default App
