import './App.css'

import { useCallback, useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'

import { isVisible } from '@sawt/feature-flags'
import { readUrlParams, writeUrlParams, hiddenFrom } from '@sawt/url-state'
import { useCopyLink, COPY_ICON, useFitText } from '@sawt/ui'
import { useGame, useRace, useSadaSettings } from '@sawt/game'

import SettingsPanel from './SettingsPanel'
import { GameScore, GameActions, ResultsPeek, RaceScore, RacePanel } from './GameHud'
import { Settings, DEFAULT_SETTINGS, loadSettings, saveSettings, applyTheme, preferredSound } from './settingsStore'
import { ensureCached, idbCount, idbClear } from './audioCache'
import { useAudio } from './useAudio'
import { translator, languageName, UI_LANGUAGES } from './i18n'
import { Digit, Language } from './digits/Digit'
import { d0 } from './digits/0'
import { d1 } from './digits/1'
import { d2 } from './digits/2'
import { d3 } from './digits/3'
import { d4 } from './digits/4'
import { d5 } from './digits/5'
import { d6 } from './digits/6'
import { d7 } from './digits/7'
import { d8 } from './digits/8'
import { d9 } from './digits/9'
import { d10 } from './digits/10'
import { d11 } from './digits/11'
import { d12 } from './digits/12'
import { d13 } from './digits/13'
import { d14 } from './digits/14'
import { d15 } from './digits/15'

// every digit, in ascending order; the code doubles as the sound file name. The
// order matters: `?i=0-9` reads a range as positions in this list, since these
// codes are strings and '10' sorts before '9'
const DIGIT_DEFS: Digit[] = [d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15]

/*
 * The room a link may have brought this child to. Read once, at load, because
 * joining cleans `?room=` out of the address bar — a value re-derived during a
 * render would disappear the moment the room was entered, taking the lobby's
 * own panel with it.
 */
const INVITED_TO = new URLSearchParams(window.location.search).get('room') ?? undefined

function App() {
	// the spoken languages, under their own native names (after the beta flag)
	const LANGUAGE_DEFS: { code: Language, display: string, beta?: boolean }[] = [
		{ code: 'ar', display: 'عربي' },
		{ code: 'en', display: 'English' },
		{ code: 'de', display: 'Deutsch' },
		{ code: 'sv', display: 'Svenska' },
		{ code: 'fr', display: 'Français' },
		{ code: 'tr', display: 'Türkçe' },
		{ code: 'fa', display: 'فارسی' },
		{ code: 'ru', display: 'Русский' },
		{ code: 'fi', display: 'Suomi' },
		{ code: 'es', display: 'Español' },
		{ code: 'he', display: 'עברית' },
		{ code: 'el', display: 'Ελληνικά' },
	]
	const ALL_LANGUAGES = LANGUAGE_DEFS.filter(isVisible)
	// every digit this build offers, before the user's own choice of range
	const ALL_DIGITS = DIGIT_DEFS.filter(isVisible)
	// code of the selected language (the spoken and spelled number words); follows
	// the interface language when we speak it, else English (see preferredSound)
	const [selectedCode, setSelectedCode] = useState(() => preferredSound())
	const [spelledNumber, setSpelledNumber] = useState('')

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

	// user settings (theme + which languages to show)
	const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
	useEffect(() => {
		let loaded = loadSettings()

		// URL parameters for a shareable deep link — see the README. Anything
		// unusable is ignored rather than applied, so a mistyped code cannot leave
		// the app blank.
		// ?i= is a range here (`0-9`, `10-12`), not a list: the digits are one
		// ordered run, so a range is what a link would want to say.
		const url = readUrlParams(window.location.search, {
			items: ALL_DIGITS.map(d => d.code),
			itemsAsRange: true,
			sounds: ALL_LANGUAGES.map(l => l.code),
			uiLanguages: UI_LANGUAGES.map(l => l.code),
		})
		if (url.items) {
			loaded = { ...loaded, hiddenDigits: hiddenFrom(ALL_DIGITS.map(d => d.code), url.items) }
		}
		if (url.sounds) {
			loaded = { ...loaded, hiddenLanguages: hiddenFrom(ALL_LANGUAGES.map(l => l.code), url.sounds) }
			setSelectedCode(url.sounds[0]) // first listed = selected
		}
		if (url.uiLanguage) loaded = { ...loaded, uiLanguage: url.uiLanguage }
		if (url.theme) loaded = { ...loaded, theme: url.theme }

		setSettings(loaded)
		applyTheme(loaded.theme)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const updateSettings = (next: Settings) => {
		// flight mode: download what is (or becomes) visible. Each language needs
		// the digits still on the board plus its language-name sound — read from
		// `next`, so narrowing the range does not keep caching digits it dropped.
		const visibleLangs = ALL_LANGUAGES.filter(l => !next.hiddenLanguages.includes(l.code))
		const visibleDigits = ALL_DIGITS.filter(d => !next.hiddenDigits.includes(d.code))
		const urlsFor = (langs: typeof visibleLangs) =>
			langs.flatMap(l => [
				...visibleDigits.map(d => `/sound/lang/${l.code}/${d.code}.aac`),
				`/sound/lang/${l.code}/${l.code}.aac`,
			])
		if (next.flightMode && !settings.flightMode) {
			// just switched on: cache everything currently visible
			cacheAudioUrls(urlsFor(visibleLangs))
		} else if (next.flightMode) {
			// already on: cache only the languages that just became visible
			const newLangs = visibleLangs.filter(l => settings.hiddenLanguages.includes(l.code))
			if (newLangs.length > 0) {
				cacheAudioUrls(urlsFor(newLangs))
			}
		}

		setSettings(next)
		saveSettings(next)
		applyTheme(next.theme)
	}

	const LANGUAGES = ALL_LANGUAGES.filter(l => !settings.hiddenLanguages.includes(l.code))
	// the digits on the board, after the chosen range
	const DIGITS = ALL_DIGITS.filter(d => !settings.hiddenDigits.includes(d.code))
	// the selected language object; undefined when every language is hidden
	const lang = LANGUAGES.find(l => l.code === selectedCode)

	// if the selected language gets hidden in settings, fall back to the first visible one
	useEffect(() => {
		if (LANGUAGES.length > 0 && !LANGUAGES.some(l => l.code === selectedCode)) {
			setSelectedCode(LANGUAGES[0].code)
			setSpelledNumber('')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings.hiddenLanguages])

	// switching language also plays the language's own name sound
	const handleLanguageChange = async (code: string) => {
		await audio.play(`/sound/lang/${code}/${code}.aac`)
		setSelectedCode(code)
		setSpelledNumber('')
	}

	/*
	 * The sound file of a number. In the selected language by default — and in
	 * a given one when asked, which is what a courtyard held to the host's
	 * language needs: the same numbers, spoken in a language this child did
	 * not choose.
	 */
	const numberUrl = (code: string, sound: string = lang?.code ?? selectedCode) =>
		`/sound/lang/${sound}/${code}.aac`

	// the game: the numbers stay in order (no shuffle) — only the prompts are random
	// tell sada when the languages change — gated and silent, see @sawt/game
	useSadaSettings('number', settings.uiLanguage, selectedCode)

	const game = useGame<{ code: string, value: number }>({
		canPlay: LANGUAGES.length > 0 && lang !== undefined && DIGITS.length > 0,
		buildBoard: () => DIGITS,
		promptUrl: n => numberUrl(n.code),
		preload: async urls => {
			await ensureCached(urls)
			refreshCacheCount()
		},
		audio,
		// a round is labelled by the language it was played in
		mode: selectedCode,
		app: 'number',
		onRoundStart: () => setSpelledNumber(''),
	})

	/*
	 * The courtyard: the same numbers, but the board, the order and every
	 * verdict come from saha, so that two children — each hearing their own
	 * language — race the very same round. It sits beside the solo game rather
	 * than inside it; whichever one is on decides what the cards do.
	 */
	const race = useRace({
		app: 'number',
		// only what this child can actually hear right now
		playable: () => DIGITS.map(d => d.code),
		promptUrl: numberUrl,
		preload: async urls => {
			await ensureCached(urls)
			refreshCacheCount()
		},
		audio,
		// the same label the solo round carries, posted as `race:<language>`
		mode: selectedCode,
		// the language this child is set to — what a host may hold a room to
		sound: lang?.code ?? selectedCode,
		onRoundStart: () => setSpelledNumber(''),
	})
	// a round is on and the cards belong to it
	const racing = race.on && race.phase !== 'lobby' && race.phase !== 'connecting'
	const byCode = (code: string) => ALL_DIGITS.find(d => d.code === code)

	/*
	 * The language actually being spoken: this child's, unless the room is
	 * being held to the host's. Both the audio and the *word on the display*
	 * follow it — a race heard in Arabic whose display reads "sju" would hand
	 * every answer to the child who can read.
	 *
	 * A room held to a language this build does not have (an older or newer
	 * app across the courtyard) falls back to this child's own rather than
	 * fetching a URL nobody has: they hear their own language and can still
	 * play, which is the same graceful degrade the rest of saha uses.
	 */
	const known = (sound: string | null): Language | null =>
		ALL_LANGUAGES.some(l => l.code === sound) ? sound as Language : null
	const heard = known(race.sound) ?? lang?.code ?? null

	/*
	 * A raced board is filtered rather than taken in the order it arrived: the
	 * numbers mean something in their own order, and a courtyard is no reason
	 * to put 11 before 3.
	 */
	const board = racing ? DIGITS.filter(d => race.board.includes(d.code)) : DIGITS

	// what a card is, right now: solo game, race, or just a number to hear
	const solved = racing ? race.done : game.solved
	const wrongs = racing ? race.wrong : game.wrongGuesses
	const currentTarget = racing ? race.target : game.target
	const feedback = racing ? race.feedback : game.feedback
	// what the display segment shows: the prompted number's name during a round
	// (so the game is playable while muted), otherwise the last clicked name. In
	// a courtyard it is the word in the language being spoken, which is not
	// always this child's own
	const displayText = currentTarget !== null && (game.gameOn || racing) && heard
		? (byCode(currentTarget)?.name[heard] ?? '')
		: spelledNumber

	// UI-string translator, following the interface language chosen in settings
	// (independent of the content/number language; falls back to English)
	const t = translator(settings.uiLanguage)
	const setUiLanguage = (code: string) => updateSettings({ ...settings, uiLanguage: code })

	// content languages as { code, display } with names in the UI language,
	// sorted alphabetically by that display name (using the UI language's collation)
	const localizedContent = (list: { code: string, display: string }[]) => list
		.map(l => ({ code: l.code, display: languageName(t, l.code, l.display) }))
		.sort((a, b) => a.display.localeCompare(b.display, settings.uiLanguage))

	// a link that reproduces what is on screen: the digit range, the visible
	// languages with the selected one first, the interface language and the theme
	const shareUrl = () => window.location.origin + window.location.pathname + writeUrlParams({
		items: { all: ALL_DIGITS.map(d => d.code), visible: DIGITS.map(d => d.code), asRange: true },
		sounds: {
			all: ALL_LANGUAGES.map(l => l.code),
			visible: [selectedCode, ...LANGUAGES.map(l => l.code).filter(c => c !== selectedCode)],
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
		<div className="Number">
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
						title={t('lang.title')}
						value={lang ? lang.code : ''}
						disabled={game.target !== null || race.on}
						onChange={(e) => handleLanguageChange(e.target.value)}
					>
						{localizedContent(LANGUAGES).map(l => (
							<option key={`lang-${l.code}`} value={l.code}>{l.display}</option>
						))}
					</select>
					<SettingsPanel
						settings={settings}
						languages={localizedContent(ALL_LANGUAGES)}
						digits={ALL_DIGITS}
						shareUrl={shareUrl}
						caching={caching}
						cachedCount={cachedCount}
						locked={game.gameOn || race.on}
						t={t}
						uiLanguage={settings.uiLanguage}
						uiLanguages={UI_LANGUAGES}
						onSetUiLanguage={setUiLanguage}
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
						total={game.board.length}
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
						onReplay={() => race.target && audio.play(numberUrl(race.target, heard ?? undefined))}
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
			<hgroup>
				{board.map(n => {
					/*
					 * A solo round's 🤷‍♂️ is the solo round's alone: it outlives the
					 * round that made it (nothing clears it until the next one
					 * starts), so without this guard a child who gave up on 7 and
					 * then opened a courtyard would find 7 greyed out — and
					 * unwinnable when the room asked for it. A courtyard's
					 * given-up cards arrive with the board instead.
					 */
					const isGivenUp = !racing && game.gameOn && game.gaveUpCodes.includes(n.code)
					const isSolved = (racing || game.gameOn) && solved.includes(n.code) && !isGivenUp
					const isWrong = (racing || game.gameOn) && wrongs.includes(n.code)
					return (
						<button
							key={`number-${n.code}`}
							className={'button-number' + (audio.playingCode === n.code ? ' playing' : '') + (isWrong ? ' wrong' : '')}
							title={(game.gameOn || racing) ? '' : (lang ? n.name[lang.code] : '🤷‍♂️')}
							disabled={isSolved || isGivenUp || isWrong}
							onClick={() => {
								if (racing) {
									race.tap(n.code)
								} else if (game.gameOn) {
									game.guess(n.code)
								} else if (audio.playingCode === n.code) {
									// clicking the playing number again stops the sound
									audio.stopSound()
								} else if (!lang) {
									// every language is hidden: nothing to say
									setSpelledNumber('🤷‍♂️')
								} else {
									audio.play(numberUrl(n.code), n.code)
									setSpelledNumber(n.name[lang.code])
								}
							}}
						>
							{n.value}
							{audio.playingCode === n.code && <span className="play-icon">▶</span>}
							{/*
							  * A settled card wears its winner: 👍 at the top right, the
							  * animal of whoever got there first at the top left. In a
							  * courtyard a card can also settle with nobody winning it —
							  * the room voted it away, or it timed out — and that one
							  * gets 🤷‍♂️ and no animal, the same as giving up alone.
							  */}
							{isSolved && racing && race.wonBy(n.code) && (
								<span className="swatch-winner">{race.wonBy(n.code)}</span>
							)}
							{isSolved && (
								<span className="swatch-mark">
									{racing && !race.wonBy(n.code) ? '🤷‍♂️' : '👍'}
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
