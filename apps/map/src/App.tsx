import './App.css'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'

import { isVisible } from '@sawt/feature-flags'
import { readUrlParams, writeUrlParams, hiddenFrom } from '@sawt/url-state'
import { useGame } from '@sawt/game'
import { useFitText } from '@sawt/ui'

import SettingsPanel from './SettingsPanel'
import { GameScore, GameActions } from './GameHud'
import { Country, hasSound } from './countries/Country'
import { SoundLanguage } from './languages'
import { WorldMap, World, Shape, CountryState } from './WorldMap'
import {
	Settings,
	DEFAULT_SETTINGS,
	loadSettings,
	saveSettings,
	applyTheme,
	preferredSound,
} from './settingsStore'
import { ensureCached, getAudioBlob, idbCount, idbClear } from './audioCache'
import { useAudio } from './useAudio'
import { translator, languageName, UI_LANGUAGES, UiLanguage } from './i18n'
import { ad } from './countries/ad'
import { ae } from './countries/ae'
import { al } from './countries/al'
import { ao } from './countries/ao'
import { ar } from './countries/ar'
import { at } from './countries/at'
import { au } from './countries/au'
import { ba } from './countries/ba'
import { be } from './countries/be'
import { br } from './countries/br'
import { bg } from './countries/bg'
import { ca } from './countries/ca'
import { cd } from './countries/cd'
import { ch } from './countries/ch'
import { cn } from './countries/cn'
import { cz } from './countries/cz'
import { de } from './countries/de'
import { dk } from './countries/dk'
import { dz } from './countries/dz'
import { eg } from './countries/eg'
import { es } from './countries/es'
import { fr } from './countries/fr'
import { gb } from './countries/gb'
import { gi } from './countries/gi'
import { gr } from './countries/gr'
import { hr } from './countries/hr'
import { hu } from './countries/hu'
import { id } from './countries/id'
import { ind } from './countries/in'
import { iq } from './countries/iq'
import { ir } from './countries/ir'
import { is } from './countries/is'
import { it } from './countries/it'
import { jp } from './countries/jp'
import { kz } from './countries/kz'
import { lb } from './countries/lb'
import { lu } from './countries/lu'
import { ly } from './countries/ly'
import { ma } from './countries/ma'
import { ml } from './countries/ml'
import { mn } from './countries/mn'
import { mx } from './countries/mx'
import { ne } from './countries/ne'
import { nl } from './countries/nl'
import { no } from './countries/no'
import { om } from './countries/om'
import { pe } from './countries/pe'
import { pl } from './countries/pl'
import { ps } from './countries/ps'
import { pt } from './countries/pt'
import { rs } from './countries/rs'
import { ru } from './countries/ru'
import { sa } from './countries/sa'
import { sd } from './countries/sd'
import { se } from './countries/se'
import { sk } from './countries/sk'
import { sy } from './countries/sy'
import { td } from './countries/td'
import { th } from './countries/th'
import { tn } from './countries/tn'
import { tr } from './countries/tr'
import { ua } from './countries/ua'
import { us } from './countries/us'
import { va } from './countries/va'

function App() {
	// everything the build supports (after the beta feature flag). No gb-sct
	// here, unlike Flag: the map's United Kingdom is a single shape, so Scotland
	// has no geometry of its own to click.
	const ALL_COUNTRIES: Country[] = [ad, ae, al, ao, ar, at, au, ba, be, bg, br, ca, cd, ch, cn, cz, de, dk, dz, eg, es, fr, gb, gi, gr, hr, hu, id, ind, iq, ir, is, it, jp, kz, lb, lu, ly, ma, ml, mn, mx, ne, nl, no, om, pe, pl, ps, pt, rs, ru, sa, sd, se, sk, sy, td, th, tn, tr, ua, us, va].filter(isVisible)
	const LANGUAGE_DEFS: { code: SoundLanguage, display: string, beta?: boolean }[] = [
		{ code: 'sq', display: 'Shqip' },
		{ code: 'ar', display: 'عربي' },
		{ code: 'da', display: 'Dansk' },
		{ code: 'en', display: 'English' },
		{ code: 'de', display: 'Deutsch' },
		{ code: 'fa', display: 'فارسی' },
		{ code: 'pt', display: 'Português' },
		{ code: 'sv', display: 'Svenska' },
		{ code: 'tr', display: 'Türkçe' },
		{ code: 'uk', display: 'Українська' },
	]
	const ALL_LANGUAGES = LANGUAGE_DEFS.filter(isVisible)

	// the map geometry, fetched through the sound cache so ✈️ covers it too;
	// null while loading, and `failed` if neither cache nor network had it
	const [world, setWorld] = useState<World | null>(null)
	const [worldFailed, setWorldFailed] = useState(false)
	useEffect(() => {
		let live = true
		getAudioBlob('/world.json')
			.then(blob => (blob ? blob.text() : Promise.reject(new Error('unavailable'))))
			.then(text => { if (live) setWorld(JSON.parse(text) as World) })
			.catch(() => { if (live) setWorldFailed(true) })
		return () => { live = false }
	}, [])

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
	// the selected sound: the language the country name is spoken in. Declared
	// above the settings effect, which sets it from a ?s= parameter.
	const [lang, setLang] = useState<SoundLanguage>(() => preferredSound())

	useEffect(() => {
		refreshCacheCount()
	}, [refreshCacheCount])

	// playback, mute and the feedback sounds
	const audio = useAudio(refreshCacheCount)

	// user settings (theme + which languages/countries to show on the map)
	const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
	useEffect(() => {
		let loaded = loadSettings()

		// URL parameters for a shareable deep link — see the README. Anything
		// unusable is ignored rather than applied, so a mistyped code cannot leave
		// the app blank.
		const url = readUrlParams(window.location.search, {
			items: ALL_COUNTRIES.map(c => c.code),
			sounds: ALL_LANGUAGES.map(l => l.code),
			uiLanguages: UI_LANGUAGES.map(l => l.code),
		})
		if (url.items) {
			loaded = { ...loaded, hiddenCountries: hiddenFrom(ALL_COUNTRIES.map(c => c.code), url.items) }
		}
		if (url.sounds) {
			loaded = { ...loaded, hiddenLanguages: hiddenFrom(ALL_LANGUAGES.map(l => l.code), url.sounds) as SoundLanguage[] }
			setLang(url.sounds[0] as SoundLanguage) // first listed = selected
		}
		if (url.uiLanguage) loaded = { ...loaded, uiLanguage: url.uiLanguage as typeof loaded.uiLanguage }
		if (url.theme) loaded = { ...loaded, theme: url.theme }

		setSettings(loaded)
		applyTheme(loaded.theme)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const [spokenName, setSpokenName] = useState('')
	// the country whose name is showing/playing, kept colored on the map until
	// the next click (mirrors spokenName, not the transient playingCode)
	const [clickedCode, setClickedCode] = useState<string | null>(null)

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
		// stop playback when its country, or the selected language, just got hidden —
		// otherwise the sound would keep playing with nothing left to stop it
		if (
			(audio.playingCode && next.hiddenCountries.includes(audio.playingCode)) ||
			next.hiddenLanguages.includes(lang)
		) {
			audio.stopSound()
		}

		// flight mode: download what is (or becomes) visible. The map itself is
		// part of the download, so ✈️ works offline end to end.
		const visibleLangs = ALL_LANGUAGES.filter(l => !next.hiddenLanguages.includes(l.code))
		const visibleCountries = ALL_COUNTRIES.filter(c => !next.hiddenCountries.includes(c.code))
		const urlsFor = (langs: typeof visibleLangs, countries: typeof visibleCountries) =>
			langs.flatMap(l => countries
				.filter(c => hasSound(c, l.code))
				.map(c => `/sound/lang/${l.code}/${c.code}.aac`))
		if (next.flightMode && !settings.flightMode) {
			// just switched on: cache everything currently visible
			cacheAudioUrls(['/world.json', ...urlsFor(visibleLangs, visibleCountries)])
		} else if (next.flightMode) {
			// already on: cache only what just became visible
			const newLangs = visibleLangs.filter(l => settings.hiddenLanguages.includes(l.code))
			const newCountries = visibleCountries.filter(c => settings.hiddenCountries.includes(c.code))
			const oldLangs = visibleLangs.filter(l => !settings.hiddenLanguages.includes(l.code))
			const urls = [
				...urlsFor(newLangs, visibleCountries),
				...urlsFor(oldLangs, newCountries),
			]
			if (urls.length > 0) {
				cacheAudioUrls(urls)
			}
		}

		setSettings(next)
		saveSettings(next)
		applyTheme(next.theme)
	}

	const LANGUAGES = ALL_LANGUAGES.filter(l => !settings.hiddenLanguages.includes(l.code))
	// the countries that can be played and guessed: visible AND recorded in the
	// selected hearing language — a country without that recording goes grey on
	// the map rather than clicking silently. No sorting here, unlike the sibling
	// apps: the map's layout is geography.
	const COUNTRIES = ALL_COUNTRIES.filter(c =>
		!settings.hiddenCountries.includes(c.code) && hasSound(c, lang))
	const countryByCode = useMemo(
		() => new Map(ALL_COUNTRIES.map(c => [c.code, c])),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	)
	const playable = useMemo(
		() => new Set(COUNTRIES.map(c => c.code)),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[settings.hiddenCountries, lang],
	)

	// if the selected language gets hidden in settings, fall back to the first visible one
	useEffect(() => {
		if (LANGUAGES.length > 0 && !LANGUAGES.some(l => l.code === lang)) {
			setLang(LANGUAGES[0].code)
			setSpokenName('')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings.hiddenLanguages])

	// the sound file of a country's name in the selected language
	const countryUrl = (code: string) => `/sound/lang/${lang}/${code}.aac`

	// the game: find the named country on the map. The board is the map itself,
	// so nothing shuffles — the prompts are random either way.
	const game = useGame<Country>({
		canPlay: world !== null && LANGUAGES.length > 0 && COUNTRIES.length > 0,
		buildBoard: () => COUNTRIES,
		promptUrl: c => countryUrl(c.code),
		preload: async urls => {
			await ensureCached(urls)
			refreshCacheCount()
		},
		audio,
		// a round is labelled by the language it was played in
		mode: lang,
		onRoundStart: () => {
			setSpokenName('')
			setClickedCode(null)
		},
	})

	// what the display segment shows: the prompted name during a round (the
	// challenge is where, not what — and the game stays playable while muted),
	// otherwise the last clicked name
	const displayText = game.gameOn && game.target !== null
		? (game.board.find(c => c.code === game.target)?.name[lang] ?? '')
		: spokenName

	// UI-string translator, following the interface language chosen in settings
	// (independent of the content/country-name language; falls back to English)
	const t = translator(settings.uiLanguage)
	const setUiLanguage = (code: string) => updateSettings({ ...settings, uiLanguage: code as UiLanguage })

	// how each country is drawn on the map right now
	const stateOf = useCallback((code: string): CountryState => {
		if (!playable.has(code)) return 'unsupported'
		if (game.gameOn) {
			// a given-up code is also in solved, so check it first
			if (game.gaveUpCodes.includes(code)) return 'givenUp'
			if (game.solved.includes(code)) return 'correct'
			if (game.wrongGuesses.includes(code)) return 'wrong'
			return 'idle'
		}
		return code === clickedCode ? 'clicked' : 'idle'
	}, [playable, game.gameOn, game.gaveUpCodes, game.solved, game.wrongGuesses, clickedCode])

	// hover text: the name in the interface language for taught countries, the
	// atlas name for the rest — and nothing at all during a game
	const tipOf = useCallback((shape: Shape): string | null => {
		if (game.gameOn) return null
		const country = shape.c ? countryByCode.get(shape.c) : undefined
		return country?.name[settings.uiLanguage] ?? shape.n
	}, [game.gameOn, countryByCode, settings.uiLanguage])

	const nameOf = useCallback(
		(code: string) => {
			const country = countryByCode.get(code)
			return country?.name[settings.uiLanguage] ?? code
		},
		[countryByCode, settings.uiLanguage],
	)

	const onCountryClick = useCallback((code: string) => {
		if (!playable.has(code)) return
		if (game.gameOn) {
			game.guess(code)
			return
		}
		if (audio.playingCode === code) {
			audio.stopSound()
			return
		}
		if (LANGUAGES.length === 0) {
			// every language is hidden: nothing to say
			setSpokenName('🤷‍♂️')
			setClickedCode(code)
			return
		}
		audio.play(countryUrl(code), code)
		setSpokenName(countryByCode.get(code)?.name[lang] ?? '')
		setClickedCode(code)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [playable, game.gameOn, game.guess, audio, lang, LANGUAGES.length, countryByCode])

	// content languages as { code, display } with names in the UI language,
	// sorted alphabetically by that display name (using the UI language's collation)
	const localizedContent = (list: { code: SoundLanguage, display: string }[]) => list
		.map(l => ({ code: l.code, display: languageName(t, l.code, l.display) }))
		.sort((a, b) => a.display.localeCompare(b.display, settings.uiLanguage))

	// a link that reproduces what is on screen: the visible countries, the visible
	// languages with the selected one first, the interface language and the theme
	const shareUrl = () => window.location.origin + window.location.pathname + writeUrlParams({
		items: { all: ALL_COUNTRIES.map(c => c.code), visible: COUNTRIES.map(c => c.code) },
		sounds: {
			all: ALL_LANGUAGES.map(l => l.code),
			visible: [lang, ...LANGUAGES.map(l => l.code).filter(c => c !== lang)],
		},
		uiLanguage: settings.uiLanguage,
		theme: settings.theme,
	})

	// shrink the display font before falling back to the marquee
	const displayRef = useFitText(displayText)

	return (
		<div className="Map">
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
						value={lang}
						disabled={game.target !== null}
						onChange={(e) => {
							setLang(e.target.value as SoundLanguage)
							setSpokenName('')
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
						countries={ALL_COUNTRIES.map(c => ({ code: c.code, flag: c.flag }))}
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
			{worldFailed && (
				<p className="map-message">🗺️ ⚠️</p>
			)}
			{!worldFailed && !world && (
				<div className="map-loading" aria-hidden="true"/>
			)}
			{world && (
				<WorldMap
					world={world}
					stateOf={stateOf}
					tipOf={tipOf}
					nameOf={nameOf}
					onCountryClick={onCountryClick}
				/>
			)}
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
