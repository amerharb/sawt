import './App.css'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'

import { isVisible } from '@sawt/feature-flags'
import { readUrlParams, writeUrlParams, hiddenFrom } from '@sawt/url-state'
import { useGame } from '@sawt/game'
import { useFitText } from '@sawt/ui'

import SettingsPanel from './SettingsPanel'
import { GameScore, GameActions, ResultsPeek } from './GameHud'
import { Country, hasSound } from './countries/Country'
import { SoundLanguage } from './languages'
import { WorldMap, World, Shape, Tip, CountryState, MapView, distanceToCountry } from './WorldMap'
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
import { fi } from './countries/fi'
import { fj } from './countries/fj'
import { fm } from './countries/fm'
import { fr } from './countries/fr'
import { ga } from './countries/ga'
import { gb } from './countries/gb'
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

function App() {
	// everything the build supports (after the beta feature flag). No gb-sct
	// here, unlike Flag: the map's United Kingdom is a single shape, so Scotland
	// has no geometry of its own to click.
	const ALL_COUNTRIES: Country[] = [ad, ae, af, ag, al, am, ao, ar, at, au, az, ba, bb, bd, be, bf, bg, bh, bi, bj, bn, bo, br, bs, bt, bw, by, bz, ca, cd, cf, cg, ch, ci, cl, cm, cn, co, cr, cu, cv, cy, cz, de, dj, dk, dm, dom, dz, ec, ee, eg, eh, er, es, et, fi, fj, fm, fr, ga, gb, gd, ge, gh, gi, gl, gm, gn, gq, gr, gt, gw, gy, hk, hn, hr, ht, hu, id, ie, ind, iq, ir, is, it, jm, jo, jp, ke, kg, kh, ki, km, kn, kp, kr, kw, kz, la, lb, lc, li, lk, lr, ls, lt, lu, lv, ly, ma, mc, md, me, mg, mh, mk, ml, mm, mn, mo, mr, mt, mu, mv, mw, mx, my, mz, na, ne, ng, ni, nl, no, np, nr, nz, om, pa, pe, pg, ph, pk, pl, ps, pt, pw, py, qa, ro, rs, ru, rw, sa, sb, sc, sd, se, sg, si, sk, sl, sm, sn, so, sr, ss, st, sv, sy, sz, td, tg, th, tj, tl, tm, tn, to, tr, tt, tv, tw, tz, ua, ug, us, uy, uz, va, vc, ve, vn, vu, ws, xc, xk, ye, za, zm, zw].filter(isVisible)
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
	// the flag of whatever the display is naming, shown beside the name
	const [spokenFlag, setSpokenFlag] = useState('')
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
	// every code we teach, for the map's dynamic markers — session-stable like
	// the map above it, so the memoized marker set never churns on re-renders
	const allCodes = useMemo(() => [...countryByCode.keys()], [countryByCode])
	const settingsCountries = useMemo(
		() => ALL_COUNTRIES
			.map(c => ({ code: c.code, flag: c.flag, name: c.name[settings.uiLanguage] }))
			.sort((a, b) => a.name.localeCompare(b.name, settings.uiLanguage)),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[settings.uiLanguage],
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

	/*
	 * Near-miss forgiveness: in the game, a finger aiming at a small country
	 * easily lands on a neighbour or in the sea. A wrong click within
	 * MISS_FORGIVENESS map units of the target (at ×1 — the tolerance shrinks
	 * with the zoom, since finger error is roughly constant on screen) is not
	 * counted: the map zooms in MISS_ZOOM× around the click instead, and the
	 * player tries again — at most MISS_ZOOM_LIMIT times per prompt, so ×4 in
	 * total, after which misses count normally. Zooming is centred on the
	 * click, never on the target, so it cannot leak the answer.
	 */
	const MISS_FORGIVENESS = 30
	const MISS_ZOOM = 2
	const MISS_ZOOM_LIMIT = 2
	// the forgiveness state remembers its prompt and dies with it — when the
	// target changes (found, given up, round over) the view snaps back to the
	// whole world without an effect
	const [miss, setMiss] = useState<{ target: string, zooms: number, view: MapView } | null>(null)

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
			setSpokenFlag('')
			setClickedCode(null)
		},
	})

	const missActive = miss !== null && game.gameOn && miss.target === game.target ? miss : null

	// what the display segment shows — flag then name: the prompted country
	// during a round (the challenge is where, not what — and the game stays
	// playable while muted), otherwise the last clicked one
	const prompted = game.gameOn && game.target !== null
		? game.board.find(c => c.code === game.target)
		: undefined
	const displayName = prompted ? (prompted.name[lang] ?? '') : spokenName
	const displayFlag = prompted ? prompted.flag : spokenFlag

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
	const tipOf = useCallback((shape: Shape): Tip | null => {
		if (game.gameOn) return null
		const country = shape.c ? countryByCode.get(shape.c) : undefined
		// untaught land keeps its atlas name and gets no flag
		return country
			? { flag: country.flag, name: country.name[settings.uiLanguage] }
			: { flag: '', name: shape.n }
	}, [game.gameOn, countryByCode, settings.uiLanguage])

	const nameOf = useCallback(
		(code: string) => {
			const country = countryByCode.get(code)
			return country?.name[settings.uiLanguage] ?? code
		},
		[countryByCode, settings.uiLanguage],
	)

	const onMapClick = useCallback((code: string | null, point: { x: number, y: number } | null) => {
		if (game.gameOn) {
			// a near miss zooms in for another chance instead of counting
			if (world && point && game.target !== null && code !== game.target) {
				const zooms = missActive?.zooms ?? 0
				const zoom = Math.pow(MISS_ZOOM, zooms)
				if (zooms < MISS_ZOOM_LIMIT
					&& distanceToCountry(world, game.target, point.x, point.y) <= MISS_FORGIVENESS / zoom) {
					const scale = zoom * MISS_ZOOM
					const x0 = world.x0 ?? 0
					const w = world.width / scale
					const h = world.height / scale
					setMiss({
						target: game.target,
						zooms: zooms + 1,
						view: {
							x: Math.min(Math.max(point.x - w / 2, x0), x0 + world.width - w),
							y: Math.min(Math.max(point.y - h / 2, 0), world.height - h),
							w,
							h,
						},
					})
					return
				}
			}
			if (code && playable.has(code)) game.guess(code)
			return
		}
		if (!code || !playable.has(code)) return
		if (audio.playingCode === code) {
			audio.stopSound()
			return
		}
		if (LANGUAGES.length === 0) {
			// every language is hidden: nothing to say
			setSpokenName('🤷‍♂️')
			setSpokenFlag('')
			setClickedCode(code)
			return
		}
		audio.play(countryUrl(code), code)
		setSpokenName(countryByCode.get(code)?.name[lang] ?? '')
		setSpokenFlag(countryByCode.get(code)?.flag ?? '')
		setClickedCode(code)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [playable, game.gameOn, game.target, game.guess, world, missActive, audio, lang, LANGUAGES.length, countryByCode])

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
	const displayRef = useFitText(displayFlag + displayName)

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
						disabled={game.target !== null}
						onChange={(e) => {
							setLang(e.target.value as SoundLanguage)
							setSpokenName('')
							setSpokenFlag('')
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
						countries={settingsCountries}
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
						{game.preparing ? '⏳' : <>
							{displayFlag && <span className="display-flag flag-emoji">{displayFlag}</span>}
							{displayName}
						</>}
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
					onMapClick={onMapClick}
					view={missActive?.view ?? null}
					taughtCodes={allCodes}
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
