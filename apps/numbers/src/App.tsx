import './App.css'
import { useCallback, useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import SettingsPanel from './SettingsPanel'
import { GameScore, GameActions } from './GameHud'
import { isVisible } from './featureFlags'
import { readUrlParams, hiddenFrom } from '@sawt/url-state'
import { Settings, DEFAULT_SETTINGS, loadSettings, saveSettings, applyTheme, preferredLanguage } from './settingsStore'
import { ensureCached, idbCount, idbClear } from './audioCache'
import { useAudio } from './useAudio'
import { useGame } from './useGame'
import { useFitText } from './useFitText'
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

// the digits on the board, in order; the code doubles as the sound file name
// in ascending order — `?i=0-9` reads a range as positions in this list, since
// these codes are strings and '10' sorts before '9'
const DIGIT_DEFS: Digit[] = [d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12]

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
	]
	const ALL_LANGUAGES = LANGUAGE_DEFS.filter(isVisible)
	// every digit this build offers, before the user's own choice of range
	const ALL_DIGITS = DIGIT_DEFS.filter(isVisible)
	// code of the selected language (the spoken and spelled number words); defaults
	// to the browser's preferred language on first load
	const [selectedCode, setSelectedCode] = useState(() => preferredLanguage())
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

	// the sound file of a number in the selected language
	const numberUrl = (code: string) => `/sound/lang/${lang?.code}/${code}.aac`

	// the game: the numbers stay in order (no shuffle) — only the prompts are random
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
		onRoundStart: () => setSpelledNumber(''),
	})

	// what the display segment shows: the prompted number's name during a round
	// (so the game is playable while muted), otherwise the last clicked name
	const displayText = game.gameOn && game.target !== null && lang
		? (DIGITS.find(d => d.code === game.target)?.name[lang.code] ?? '')
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

	// shrink the display font before falling back to the marquee
	const displayRef = useFitText(displayText)

	return (
		<div className="Numbers">
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
						title={t('lang.title')}
						value={lang ? lang.code : ''}
						disabled={game.target !== null}
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
						caching={caching}
						cachedCount={cachedCount}
						locked={game.gameOn}
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
			<hgroup>
				{DIGITS.map(n => {
					const isGivenUp = game.gameOn && game.gaveUpCodes.includes(n.code)
					const isSolved = game.gameOn && game.solved.includes(n.code) && !isGivenUp
					const isWrong = game.gameOn && game.wrongGuesses.includes(n.code)
					return (
						<button
							key={`number-${n.code}`}
							className={'button-number' + (audio.playingCode === n.code ? ' playing' : '') + (isWrong ? ' wrong' : '')}
							title={game.gameOn ? '' : (lang ? n.name[lang.code] : '🤷‍♂️')}
							disabled={isSolved || isGivenUp || isWrong}
							onClick={() => {
								if (game.gameOn) {
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
