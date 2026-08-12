import './App.css'

import { useCallback, useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'

import { isVisible } from '@sawt/feature-flags'
import { shuffle, sortByCodeOrName } from '@sawt/order'
import { readUrlParams, writeUrlParams, hiddenFrom } from '@sawt/url-state'
import { useGame } from '@sawt/game'
import { useFitText } from '@sawt/ui'

import SettingsPanel from './SettingsPanel'
import { GameScore, GameActions } from './GameHud'
import { Country, Language, hasSound } from './countries/Country'
import {
	Settings,
	SortMode,
	DEFAULT_SETTINGS,
	loadSettings,
	saveSettings,
	applyTheme,
	preferredSound,
} from './settingsStore'
import { ensureCached, idbCount, idbClear } from './audioCache'
import { useAudio } from './useAudio'
import { translator, languageName, UI_LANGUAGES, UiLanguage } from './i18n'
import { ad } from './countries/ad'
import { ae } from './countries/ae'
import { af } from './countries/af'
import { al } from './countries/al'
import { ao } from './countries/ao'
import { ar } from './countries/ar'
import { at } from './countries/at'
import { au } from './countries/au'
import { ba } from './countries/ba'
import { bd } from './countries/bd'
import { be } from './countries/be'
import { bf } from './countries/bf'
import { br } from './countries/br'
import { bw } from './countries/bw'
import { by } from './countries/by'
import { bg } from './countries/bg'
import { bj } from './countries/bj'
import { bo } from './countries/bo'
import { ca } from './countries/ca'
import { cd } from './countries/cd'
import { cf } from './countries/cf'
import { cg } from './countries/cg'
import { ch } from './countries/ch'
import { ci } from './countries/ci'
import { cl } from './countries/cl'
import { cm } from './countries/cm'
import { cn } from './countries/cn'
import { co } from './countries/co'
import { cz } from './countries/cz'
import { de } from './countries/de'
import { dk } from './countries/dk'
import { dz } from './countries/dz'
import { ec } from './countries/ec'
import { eg } from './countries/eg'
import { er } from './countries/er'
import { es } from './countries/es'
import { et } from './countries/et'
import { fi } from './countries/fi'
import { fr } from './countries/fr'
import { ga } from './countries/ga'
import { gb } from './countries/gb'
import { gbSct } from './countries/gb-sct'
import { gh } from './countries/gh'
import { gi } from './countries/gi'
import { gn } from './countries/gn'
import { gr } from './countries/gr'
import { gy } from './countries/gy'
import { hn } from './countries/hn'
import { hr } from './countries/hr'
import { hu } from './countries/hu'
import { id } from './countries/id'
import { ind } from './countries/in'
import { iq } from './countries/iq'
import { ir } from './countries/ir'
import { is } from './countries/is'
import { it } from './countries/it'
import { jp } from './countries/jp'
import { ke } from './countries/ke'
import { kg } from './countries/kg'
import { kh } from './countries/kh'
import { kp } from './countries/kp'
import { kz } from './countries/kz'
import { la } from './countries/la'
import { lb } from './countries/lb'
import { lr } from './countries/lr'
import { lu } from './countries/lu'
import { ly } from './countries/ly'
import { ma } from './countries/ma'
import { mg } from './countries/mg'
import { ml } from './countries/ml'
import { mm } from './countries/mm'
import { mn } from './countries/mn'
import { mr } from './countries/mr'
import { mw } from './countries/mw'
import { mx } from './countries/mx'
import { my } from './countries/my'
import { mz } from './countries/mz'
import { na } from './countries/na'
import { ne } from './countries/ne'
import { ng } from './countries/ng'
import { ni } from './countries/ni'
import { nl } from './countries/nl'
import { no } from './countries/no'
import { np } from './countries/np'
import { nz } from './countries/nz'
import { om } from './countries/om'
import { pe } from './countries/pe'
import { pg } from './countries/pg'
import { ph } from './countries/ph'
import { pk } from './countries/pk'
import { pl } from './countries/pl'
import { ps } from './countries/ps'
import { pt } from './countries/pt'
import { py } from './countries/py'
import { ro } from './countries/ro'
import { rs } from './countries/rs'
import { ru } from './countries/ru'
import { sa } from './countries/sa'
import { sd } from './countries/sd'
import { se } from './countries/se'
import { sk } from './countries/sk'
import { sn } from './countries/sn'
import { so } from './countries/so'
import { sr } from './countries/sr'
import { ss } from './countries/ss'
import { sy } from './countries/sy'
import { td } from './countries/td'
import { th } from './countries/th'
import { tj } from './countries/tj'
import { tm } from './countries/tm'
import { tn } from './countries/tn'
import { tr } from './countries/tr'
import { tz } from './countries/tz'
import { ua } from './countries/ua'
import { ug } from './countries/ug'
import { us } from './countries/us'
import { uy } from './countries/uy'
import { uz } from './countries/uz'
import { va } from './countries/va'
import { ve } from './countries/ve'
import { vn } from './countries/vn'
import { ye } from './countries/ye'
import { za } from './countries/za'
import { zm } from './countries/zm'
import { zw } from './countries/zw'

// Fisher–Yates shuffle into a new array (used to scramble the flag positions on game start)
// Order the countries for display. 'lang' sorts by the country name in the given
function App() {
	// everything the build supports (after the beta feature flag)
	const ALL_COUNTRIES: Country[] = [ad, ae, af, al, ao, ar, at, au, ba, bd, be, bf, bg, bj, bo, br, bw, by, ca, cd, cf, cg, ch, ci, cl, cm, cn, co, cz, de, dk, dz, ec, eg, er, es, et, fi, fr, ga, gb, gbSct, gh, gi, gn, gr, gy, hn, hr, hu, id, ind, iq, ir, is, it, jp, ke, kg, kh, kp, kz, la, lb, lr, lu, ly, ma, mg, ml, mm, mn, mr, mw, mx, my, mz, na, ne, ng, ni, nl, no, np, nz, om, pe, pg, ph, pk, pl, ps, pt, py, ro, rs, ru, sa, sd, se, sk, sn, so, sr, ss, sy, td, th, tj, tm, tn, tr, tz, ua, ug, us, uy, uz, va, ve, vn, ye, za, zm, zw].filter(isVisible)
	const LANGUAGE_DEFS: { code: Language, display: string, beta?: boolean }[] = [
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
	const [lang, setLang] = useState<Language>(() => preferredSound())

	useEffect(() => {
		refreshCacheCount()
	}, [refreshCacheCount])

	// playback, mute and the feedback sounds
	const audio = useAudio(refreshCacheCount)

	// user settings (theme + which languages/countries to show on the main screen)
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
			loaded = { ...loaded, hiddenLanguages: hiddenFrom(ALL_LANGUAGES.map(l => l.code), url.sounds) as Language[] }
			setLang(url.sounds[0] as Language) // first listed = selected
		}
		if (url.uiLanguage) loaded = { ...loaded, uiLanguage: url.uiLanguage as typeof loaded.uiLanguage }
		if (url.theme) loaded = { ...loaded, theme: url.theme }

		setSettings(loaded)
		applyTheme(loaded.theme)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const [spokenName, setSpokenName] = useState('')

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
		// otherwise the sound would keep playing with no button left to stop it
		if (
			(audio.playingCode && next.hiddenCountries.includes(audio.playingCode)) ||
			next.hiddenLanguages.includes(lang)
		) {
			audio.stopSound()
		}

		// flight mode: download what is (or becomes) visible
		const visibleLangs = ALL_LANGUAGES.filter(l => !next.hiddenLanguages.includes(l.code))
		const visibleCountries = ALL_COUNTRIES.filter(c => !next.hiddenCountries.includes(c.code))
		const urlsFor = (langs: typeof visibleLangs, countries: typeof visibleCountries) =>
			langs.flatMap(l => countries
				.filter(c => hasSound(c, l.code))
				.map(c => `/sound/lang/${l.code}/${c.code}.aac`))
		if (next.flightMode && !settings.flightMode) {
			// just switched on: cache everything currently visible
			cacheAudioUrls(urlsFor(visibleLangs, visibleCountries))
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

	// choose a sort mode for the flags; choosing random reshuffles every time
	const setSort = (mode: SortMode) => {
		if (mode === 'random') {
			updateSettings({ ...settings, sortMode: 'random', randomOrder: shuffle(ALL_COUNTRIES.map(c => c.code)) })
		} else {
			updateSettings({ ...settings, sortMode: mode })
		}
	}

	const LANGUAGES = ALL_LANGUAGES.filter(l => !settings.hiddenLanguages.includes(l.code))
	// what the main screen actually shows: all countries sorted by the chosen mode,
	// then filtered to the visible ones (hidden flags still hold their sorted slot)
	const COUNTRIES = sortByCodeOrName(ALL_COUNTRIES, {
		mode: settings.sortMode,
		randomOrder: settings.randomOrder,
		// no visible language means there is no name to sort by — fall back to code
		nameOf: LANGUAGES.length > 0 ? c => c.name[lang] : undefined,
		locale: lang,
	})
		.filter(c => !settings.hiddenCountries.includes(c.code))

	// if the selected language gets hidden in settings, fall back to the first visible one
	useEffect(() => {
		if (LANGUAGES.length > 0 && !LANGUAGES.some(l => l.code === lang)) {
			setLang(LANGUAGES[0].code)
			setSpokenName('')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings.hiddenLanguages])

	// the sound file of a country's name (or anthem) in the selected language
	const countryUrl = (code: string) => `/sound/lang/${lang}/${code}.aac`

	// only countries recorded in the selected language can be played or guessed;
	// the others stay on the board, disabled (see `unavailable` below)
	const PLAYABLE = COUNTRIES.filter(c => hasSound(c, lang))

	// the game: the flags shuffle on every round
	const game = useGame<Country>({
		canPlay: LANGUAGES.length > 0 && PLAYABLE.length > 0,
		buildBoard: () => shuffle(PLAYABLE),
		promptUrl: c => countryUrl(c.code),
		preload: async urls => {
			await ensureCached(urls)
			refreshCacheCount()
		},
		audio,
		// a round is labelled by the language (or 🎺) it was played in
		mode: lang,
		onRoundStart: () => setSpokenName(''),
	})

	const board = game.gameOn ? game.board : COUNTRIES
	// what the display segment shows: the prompted name during a round (so the
	// game is playable while muted), otherwise the last clicked name
	const displayText = game.gameOn && game.target !== null
		? (game.board.find(c => c.code === game.target)?.name[lang] ?? '')
		: spokenName

	// UI-string translator, following the interface language chosen in settings
	// (independent of the content/country-name language; falls back to English)
	const t = translator(settings.uiLanguage)
	const setUiLanguage = (code: string) => updateSettings({ ...settings, uiLanguage: code as UiLanguage })

	// content languages as { code, display } with names in the UI language,
	// sorted alphabetically by that display name (using the UI language's collation)
	const localizedContent = (list: { code: Language, display: string }[]) => list
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
		<div className="Flag">
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
							setLang(e.target.value as Language)
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
						onSetSort={setSort}
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
				{board.map(c => {
					const isGivenUp = game.gameOn && game.gaveUpCodes.includes(c.code)
					const isSolved = game.gameOn && game.solved.includes(c.code) && !isGivenUp
					const isWrong = game.gameOn && game.wrongGuesses.includes(c.code)
					// not recorded in the selected language: shown, but disabled
					const unavailable = !hasSound(c, lang)
					return (
						<button
							key={`country-${c.code}`}
							className={'button-flag' + (audio.playingCode === c.code ? ' playing' : '') + (isWrong ? ' wrong' : '')}
							title={game.gameOn ? '' : (LANGUAGES.length > 0 ? c.name[lang] : '🤷‍♂️')}
							disabled={isSolved || isGivenUp || isWrong || unavailable}
							onClick={() => {
								if (game.gameOn) {
									game.guess(c.code)
								} else if (audio.playingCode === c.code) {
									audio.stopSound()
								} else if (LANGUAGES.length === 0) {
									// every language is hidden: nothing to say
									setSpokenName('🤷‍♂️')
								} else {
									audio.play(countryUrl(c.code), c.code)
									setSpokenName(c.name[lang])
								}
							}}
						>
							<span className="flag-emoji">{c.flag}</span>
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
