import './App.css'

import { useCallback, useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'

import { isVisible } from '@sawt/feature-flags'
import { readUrlParams, writeUrlParams, hiddenFrom } from '@sawt/url-state'
import { useGame } from '@sawt/game'
import { useFitText } from '@sawt/ui'

import SettingsPanel from './SettingsPanel'
import { GameScore, GameActions } from './GameHud'
import { Day, Language } from './days/Day'
import {
	Settings,
	DEFAULT_SETTINGS,
	loadSettings,
	saveSettings,
	applyTheme,
	preferredSound,
} from './settingsStore'
import { ensureCached, idbCount, idbClear } from './audioCache'
import { useAudio } from './useAudio'
import { translator, languageName, UI_LANGUAGES, UiLanguage } from './i18n'
import { sunday } from './days/1'
import { monday } from './days/2'
import { tuesday } from './days/3'
import { wednesday } from './days/4'
import { thursday } from './days/5'
import { friday } from './days/6'
import { saturday } from './days/7'

// Order the days in week order (by day number), rotated so `firstDay` leads —
// e.g. firstDay '2' (Monday) gives 2,3,4,5,6,7,1.
function orderDays(days: Day[], firstDay: string): Day[] {
	const sorted = days.slice().sort((a, b) => a.code.localeCompare(b.code))
	const start = sorted.findIndex(d => d.code === firstDay)
	if (start <= 0) return sorted // firstDay is the first day already (or not found)
	return [...sorted.slice(start), ...sorted.slice(0, start)]
}

function App() {
	// everything the build supports (after the beta feature flag)
	const ALL_DAYS: Day[] = [sunday, monday, tuesday, wednesday, thursday, friday, saturday].filter(isVisible)
	const LANGUAGE_DEFS: { code: Language, display: string, beta?: boolean }[] = [
		{ code: 'en', display: 'English' },
		{ code: 'ar', display: 'عربي' },
		{ code: 'de', display: 'Deutsch' },
		{ code: 'sv', display: 'Svenska' },
		{ code: 'uk', display: 'Українська' },
		{ code: 'he', display: 'עברית' },
		{ code: 'el', display: 'Ελληνικά' },
		{ code: 'tr', display: 'Türkçe' },
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
	// the selected sound: the language the day name is spoken in. Declared above
	// the settings effect, which sets it from a ?s= parameter.
	const [hearingLang, setHearingLang] = useState<Language>(() => preferredSound())

	useEffect(() => {
		refreshCacheCount()
	}, [refreshCacheCount])

	// playback, mute and the feedback sounds
	const audio = useAudio(refreshCacheCount)

	// user settings (theme + which languages to show + the first day of the week)
	const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
	useEffect(() => {
		let loaded = loadSettings()

		// URL parameters for a shareable deep link — see the README. Anything
		// unusable is ignored rather than applied, so a mistyped code cannot leave
		// the app blank.
		// week has no hideable items, so ?i= does not apply here
		const url = readUrlParams(window.location.search, {
			sounds: ALL_LANGUAGES.map(l => l.code),
			uiLanguages: UI_LANGUAGES.map(l => l.code),
		})
		if (url.sounds) {
			loaded = { ...loaded, hiddenLanguages: hiddenFrom(ALL_LANGUAGES.map(l => l.code), url.sounds) as Language[] }
			setHearingLang(url.sounds[0] as Language) // first listed = selected
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
		// stop playback when the hearing language just got hidden —
		// otherwise the sound would keep playing with no card left to stop it
		if (next.hiddenLanguages.includes(hearingLang)) {
			audio.stopSound()
		}

		// flight mode: download the sounds for every visible language (all seven
		// days are always shown, so only the language set can change)
		const visibleLangs = ALL_LANGUAGES.filter(l => !next.hiddenLanguages.includes(l.code))
		const urlsFor = (langs: typeof visibleLangs) =>
			langs.flatMap(l => ALL_DAYS.map(d => `/sound/lang/${l.code}/${d.code}.aac`))
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

	// choose which day the week starts on
	const setFirstDay = (code: string) => updateSettings({ ...settings, firstDay: code })

	const LANGUAGES = ALL_LANGUAGES.filter(l => !settings.hiddenLanguages.includes(l.code))
	// what the main screen shows: all seven days in week order, rotated to start
	// on the chosen first day
	const DAYS = orderDays(ALL_DAYS, settings.firstDay)

	// if the sound language gets hidden in settings, fall back to the first visible one
	useEffect(() => {
		if (LANGUAGES.length > 0 && !LANGUAGES.some(l => l.code === hearingLang)) {
			setHearingLang(LANGUAGES[0].code)
			setName('')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings.hiddenLanguages])

	// the sound file of a day's name in the hearing language
	const dayUrl = (code: string) => `/sound/lang/${hearingLang}/${code}.aac`

	// the game: days stay in week order (no shuffle) — only the prompts are random
	const game = useGame<Day>({
		canPlay: LANGUAGES.length > 0 && DAYS.length > 0,
		buildBoard: () => DAYS,
		promptUrl: d => dayUrl(d.code),
		preload: async urls => {
			await ensureCached(urls)
			refreshCacheCount()
		},
		audio,
		// a round is labelled by the sound language it was played in
		mode: hearingLang,
		onRoundStart: () => setName(''),
	})

	const board = game.gameOn ? game.board : DAYS
	// what the display segment shows: the prompted name during a round (so the
	// game is playable while muted), otherwise the last clicked name
	const displayText = game.gameOn && game.target !== null
		? (game.board.find(d => d.code === game.target)?.name[hearingLang] ?? '')
		: name
	// lay the cards out right-to-left when the interface language is RTL (e.g. Arabic),
	// so the week reads in the interface language's direction — the first day on the right
	const boardDir = UI_LANGUAGES.find(l => l.code === settings.uiLanguage)?.rtl ? 'rtl' : 'ltr'

	// UI-string translator, following the interface language, falling back to English
	const t = translator(settings.uiLanguage)
	const setUiLanguage = (code: string) => updateSettings({ ...settings, uiLanguage: code as UiLanguage })

	// content (sound) language names shown in the interface language — e.g. "Arabic"
	// in an English UI, "Arabisch" in a German UI — falling back to the native name,
	// then sorted alphabetically by that displayed name using the UI's collation
	const localizedContent = (list: { code: Language, display: string }[]) => list
		.map(l => ({ code: l.code, display: languageName(t, l.code, l.display) }))
		.sort((a, b) => a.display.localeCompare(b.display, settings.uiLanguage))

	// a link that reproduces what is on screen. No `i`: the seven days are fixed,
	// so there is nothing to hide and nothing for that parameter to say
	const shareUrl = () => window.location.origin + window.location.pathname + writeUrlParams({
		sounds: {
			all: ALL_LANGUAGES.map(l => l.code),
			visible: [hearingLang, ...LANGUAGES.map(l => l.code).filter(c => c !== hearingLang)],
		},
		uiLanguage: settings.uiLanguage,
		theme: settings.theme,
	})

	// shrink the display font before falling back to the marquee
	const displayRef = useFitText(displayText)

	return (
		<div className="Week">
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
					<label className="lang-picker" title={t('lang.sound')}>
						<select
							className="language-select"
							aria-label={t('lang.soundAria')}
							value={hearingLang}
							disabled={game.target !== null}
							onChange={(e) => {
								setHearingLang(e.target.value as Language)
								setName('')
								audio.stopSound()
							}}
						>
							{localizedContent(LANGUAGES).map(l => (
								<option key={`hearing-${l.code}`} value={l.code}>{l.display}</option>
							))}
						</select>
					</label>
					<SettingsPanel
						settings={settings}
						shareUrl={shareUrl}
						languages={localizedContent(ALL_LANGUAGES)}
						dayOptions={orderDays(ALL_DAYS, '1').map(d => ({
							code: d.code,
							label: d.name[settings.uiLanguage],
						}))}
						caching={caching}
						cachedCount={cachedCount}
						locked={game.gameOn}
						t={t}
						uiLanguage={settings.uiLanguage}
						uiLanguages={UI_LANGUAGES}
						onSetUiLanguage={setUiLanguage}
						onChange={updateSettings}
						onSetFirstDay={setFirstDay}
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
				{board.map(d => {
					const isGivenUp = game.gameOn && game.gaveUpCodes.includes(d.code)
					const isSolved = game.gameOn && game.solved.includes(d.code) && !isGivenUp
					const isWrong = game.gameOn && game.wrongGuesses.includes(d.code)
					return (
						<button
							key={`day-${d.code}`}
							className={'button-day' + (audio.playingCode === d.code ? ' playing' : '') + (isWrong ? ' wrong' : '')}
							title={game.gameOn ? '' : (LANGUAGES.length > 0 ? d.name[hearingLang] : '🤷‍♂️')}
							disabled={isSolved || isGivenUp || isWrong}
							onClick={() => {
								if (game.gameOn) {
									game.guess(d.code)
								} else if (audio.playingCode === d.code) {
									audio.stopSound()
								} else if (LANGUAGES.length === 0) {
									// every language is hidden: nothing to say
									setName('🤷‍♂️')
								} else {
									setName(d.name[hearingLang] ?? d.name.en)
									audio.play(dayUrl(d.code), d.code)
								}
							}}
						>
							<span className="day-label">{d.name[settings.uiLanguage]}</span>
							{audio.playingCode === d.code && <span className="play-icon">▶</span>}
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
