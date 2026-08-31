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
import { ag } from './countries/ag'
import { al } from './countries/al'
import { am } from './countries/am'
import { ao } from './countries/ao'
import { ar } from './countries/ar'
import { at } from './countries/at'
import { au } from './countries/au'
import { az } from './countries/az'
import { ba } from './countries/ba'
import { bb } from './countries/bb'
import { bd } from './countries/bd'
import { be } from './countries/be'
import { bf } from './countries/bf'
import { br } from './countries/br'
import { bs } from './countries/bs'
import { bt } from './countries/bt'
import { bw } from './countries/bw'
import { by } from './countries/by'
import { bz } from './countries/bz'
import { bg } from './countries/bg'
import { bh } from './countries/bh'
import { bi } from './countries/bi'
import { bj } from './countries/bj'
import { bn } from './countries/bn'
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
import { cr } from './countries/cr'
import { cu } from './countries/cu'
import { cv } from './countries/cv'
import { cy } from './countries/cy'
import { cz } from './countries/cz'
import { de } from './countries/de'
import { dj } from './countries/dj'
import { dk } from './countries/dk'
import { dm } from './countries/dm'
import { dom } from './countries/do'
import { dz } from './countries/dz'
import { ec } from './countries/ec'
import { ee } from './countries/ee'
import { eg } from './countries/eg'
import { eh } from './countries/eh'
import { er } from './countries/er'
import { es } from './countries/es'
import { et } from './countries/et'
import { eu } from './countries/eu'
import { fi } from './countries/fi'
import { fj } from './countries/fj'
import { fm } from './countries/fm'
import { fr } from './countries/fr'
import { ga } from './countries/ga'
import { gb } from './countries/gb'
import { gbEng } from './countries/gb-eng'
import { gbNir } from './countries/gb-nir'
import { gbSct } from './countries/gb-sct'
import { gbWls } from './countries/gb-wls'
import { gd } from './countries/gd'
import { ge } from './countries/ge'
import { gh } from './countries/gh'
import { gi } from './countries/gi'
import { gl } from './countries/gl'
import { gm } from './countries/gm'
import { gn } from './countries/gn'
import { gq } from './countries/gq'
import { gr } from './countries/gr'
import { gt } from './countries/gt'
import { gw } from './countries/gw'
import { gy } from './countries/gy'
import { hn } from './countries/hn'
import { hk } from './countries/hk'
import { hr } from './countries/hr'
import { ht } from './countries/ht'
import { hu } from './countries/hu'
import { id } from './countries/id'
import { ie } from './countries/ie'
import { ind } from './countries/in'
import { iq } from './countries/iq'
import { ir } from './countries/ir'
import { is } from './countries/is'
import { it } from './countries/it'
import { jm } from './countries/jm'
import { jo } from './countries/jo'
import { jp } from './countries/jp'
import { ke } from './countries/ke'
import { kg } from './countries/kg'
import { kh } from './countries/kh'
import { ki } from './countries/ki'
import { km } from './countries/km'
import { kn } from './countries/kn'
import { kp } from './countries/kp'
import { kr } from './countries/kr'
import { kw } from './countries/kw'
import { kz } from './countries/kz'
import { la } from './countries/la'
import { lb } from './countries/lb'
import { lc } from './countries/lc'
import { li } from './countries/li'
import { lk } from './countries/lk'
import { lr } from './countries/lr'
import { ls } from './countries/ls'
import { lt } from './countries/lt'
import { lu } from './countries/lu'
import { lv } from './countries/lv'
import { ly } from './countries/ly'
import { ma } from './countries/ma'
import { mc } from './countries/mc'
import { md } from './countries/md'
import { me } from './countries/me'
import { mg } from './countries/mg'
import { mh } from './countries/mh'
import { mk } from './countries/mk'
import { ml } from './countries/ml'
import { mm } from './countries/mm'
import { mn } from './countries/mn'
import { mo } from './countries/mo'
import { mr } from './countries/mr'
import { mt } from './countries/mt'
import { mu } from './countries/mu'
import { mv } from './countries/mv'
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
import { nr } from './countries/nr'
import { nz } from './countries/nz'
import { om } from './countries/om'
import { pa } from './countries/pa'
import { pe } from './countries/pe'
import { pg } from './countries/pg'
import { ph } from './countries/ph'
import { pk } from './countries/pk'
import { pl } from './countries/pl'
import { ps } from './countries/ps'
import { pt } from './countries/pt'
import { pw } from './countries/pw'
import { py } from './countries/py'
import { qa } from './countries/qa'
import { ro } from './countries/ro'
import { rs } from './countries/rs'
import { ru } from './countries/ru'
import { rw } from './countries/rw'
import { sa } from './countries/sa'
import { sb } from './countries/sb'
import { sc } from './countries/sc'
import { sd } from './countries/sd'
import { se } from './countries/se'
import { sg } from './countries/sg'
import { si } from './countries/si'
import { sk } from './countries/sk'
import { sl } from './countries/sl'
import { sm } from './countries/sm'
import { sn } from './countries/sn'
import { so } from './countries/so'
import { sr } from './countries/sr'
import { ss } from './countries/ss'
import { st } from './countries/st'
import { sv } from './countries/sv'
import { sy } from './countries/sy'
import { sz } from './countries/sz'
import { td } from './countries/td'
import { tg } from './countries/tg'
import { th } from './countries/th'
import { tj } from './countries/tj'
import { tl } from './countries/tl'
import { tm } from './countries/tm'
import { tn } from './countries/tn'
import { to } from './countries/to'
import { tr } from './countries/tr'
import { tt } from './countries/tt'
import { tv } from './countries/tv'
import { tw } from './countries/tw'
import { tz } from './countries/tz'
import { ua } from './countries/ua'
import { ug } from './countries/ug'
import { us } from './countries/us'
import { uy } from './countries/uy'
import { uz } from './countries/uz'
import { va } from './countries/va'
import { vc } from './countries/vc'
import { ve } from './countries/ve'
import { vn } from './countries/vn'
import { vu } from './countries/vu'
import { ws } from './countries/ws'
import { xc } from './countries/xc'
import { xk } from './countries/xk'
import { ye } from './countries/ye'
import { za } from './countries/za'
import { zm } from './countries/zm'
import { zw } from './countries/zw'

// Fisher–Yates shuffle into a new array (used to scramble the flag positions on game start)
// Order the countries for display. 'lang' sorts by the country name in the given
/*
 * The room a link may have brought this child to. Read once, at load, because
 * joining cleans `?room=` out of the address bar — a value re-derived during a
 * render would disappear the moment the room was entered, taking the lobby's
 * own panel with it.
 */
const INVITED_TO = new URLSearchParams(window.location.search).get('room') ?? undefined

function App() {
	// everything the build supports (after the beta feature flag)
	const ALL_COUNTRIES: Country[] = [ad, ae, af, ag, al, am, ao, ar, at, au, az, ba, bb, bd, be, bf, bg, bh, bi, bj, bn, bo, br, bs, bt, bw, by, bz, ca, cd, cf, cg, ch, ci, cl, cm, cn, co, cr, cu, cv, cy, cz, de, dj, dk, dm, dom, dz, ec, ee, eg, eh, er, es, et, eu, fi, fj, fm, fr, ga, gb, gbEng, gbNir, gbSct, gbWls, gd, ge, gh, gi, gl, gm, gn, gq, gr, gt, gw, gy, hk, hn, hr, ht, hu, id, ie, ind, iq, ir, is, it, jm, jo, jp, ke, kg, kh, ki, km, kn, kp, kr, kw, kz, la, lb, lc, li, lk, lr, ls, lt, lu, lv, ly, ma, mc, md, me, mg, mh, mk, ml, mm, mn, mo, mr, mt, mu, mv, mw, mx, my, mz, na, ne, ng, ni, nl, no, np, nr, nz, om, pa, pe, pg, ph, pk, pl, ps, pt, pw, py, qa, ro, rs, ru, rw, sa, sb, sc, sd, se, sg, si, sk, sl, sm, sn, so, sr, ss, st, sv, sy, sz, td, tg, th, tj, tl, tm, tn, to, tr, tt, tv, tw, tz, ua, ug, us, uy, uz, va, vc, ve, vn, vu, ws, xc, xk, ye, za, zm, zw].filter(isVisible)
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

	/*
	 * The sound file of a country's name. In the selected language by default —
	 * and in a given one when asked, which is what a courtyard held to the
	 * host's language needs: the same board, spoken in a language this child
	 * did not choose.
	 */
	const countryUrl = (code: string, sound: string = lang) => `/sound/lang/${sound}/${code}.aac`

	// only countries recorded in the selected language can be played or guessed;
	// the others stay on the board, disabled (see `unavailable` below)
	const PLAYABLE = COUNTRIES.filter(c => hasSound(c, lang))

	// the game: the flags shuffle on every round
	// tell sada when the languages change — gated and silent, see @sawt/game
	useSadaSettings('flag', settings.uiLanguage, lang)

	const game = useGame<Country>({
		canPlay: LANGUAGES.length > 0 && PLAYABLE.length > 0,
		// the round length deals the hand: a fresh shuffle, cut to size (0 = all)
		buildBoard: () => shuffle(PLAYABLE).slice(0, settings.roundLength || PLAYABLE.length),
		roundSize: settings.roundLength,
		promptUrl: c => countryUrl(c.code),
		preload: async urls => {
			await ensureCached(urls)
			refreshCacheCount()
		},
		audio,
		// a round is labelled by the language (or 🎺) it was played in
		mode: lang,
		app: 'flag',
		onRoundStart: () => setSpokenName(''),
	})

	/*
	 * The courtyard: the same flags, but the board, the order and every verdict
	 * come from saha, so that two children — each hearing their own language —
	 * race the very same round. It sits beside the solo game rather than inside
	 * it; whichever one is on decides what the flags do.
	 */
	const race = useRace({
		app: 'flag',
		// only what this child can actually hear right now
		playable: () => PLAYABLE.map(c => c.code),
		// a room opens with this child's round length, and keeps it for rematches
		roundSize: settings.roundLength,
		promptUrl: countryUrl,
		preload: async urls => {
			await ensureCached(urls)
			refreshCacheCount()
		},
		audio,
		// the same label the solo round carries, posted as `race:<language>`
		mode: lang,
		// the language this child is set to — what a host may hold a room to
		sound: lang,
		onRoundStart: () => setSpokenName(''),
	})
	// a round is on and the flags belong to it
	const racing = race.on && race.phase !== 'lobby' && race.phase !== 'connecting'
	const byCode = (code: string) => ALL_COUNTRIES.find(c => c.code === code)

	/*
	 * The language actually being spoken: this child's, unless the room is
	 * being held to the host's. Both the audio and the *name on the display*
	 * follow it — a race heard in Arabic whose display reads "Sverige" would
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
		? race.board.map(byCode).filter((c): c is Country => c !== undefined)
		: (game.gameOn ? game.board : COUNTRIES)

	// what a flag is, right now: solo game, race, or just a country to hear
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
						value={lang}
						disabled={game.target !== null || race.on}
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
						onReplay={() => race.target && audio.play(countryUrl(race.target, heard))}
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
				{board.map(c => {
					/*
					 * A solo round's 🤷‍♂️ is the solo round's alone: it outlives the
					 * round that made it (nothing clears it until the next one
					 * starts), so without this guard a child who gave up on Sweden
					 * and then opened a courtyard would find Sweden greyed out —
					 * and unwinnable when the room asked for it. A courtyard's
					 * given-up cards arrive with the board instead.
					 */
					const isGivenUp = !racing && game.gameOn && game.gaveUpCodes.includes(c.code)
					const isSolved = (racing || game.gameOn) && solved.includes(c.code) && !isGivenUp
					const isWrong = (racing || game.gameOn) && wrongs.includes(c.code)
					/*
					 * Not recorded in the selected language: shown, but disabled.
					 * Never in a courtyard, where the board was dealt from what
					 * everyone in the room can hear — the server has already had
					 * this thought, and a card it dealt must stay tappable.
					 */
					const unavailable = !racing && !hasSound(c, lang)
					return (
						<button
							key={`country-${c.code}`}
							className={'button-flag' + (audio.playingCode === c.code ? ' playing' : '') + (isWrong ? ' wrong' : '')}
							title={(game.gameOn || racing) ? '' : (LANGUAGES.length > 0 ? c.name[lang] : '🤷‍♂️')}
							disabled={isSolved || isGivenUp || isWrong || unavailable}
							onClick={() => {
								if (racing) {
									race.tap(c.code)
								} else if (game.gameOn) {
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
