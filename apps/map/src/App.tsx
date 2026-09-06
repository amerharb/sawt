import './App.css'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'

import { isVisible } from '@sawt/feature-flags'
import { shuffle } from '@sawt/order'
import { readUrlParams, writeUrlParams, hiddenFrom } from '@sawt/url-state'
import { useGame, useRace, useSadaSettings, avatarColor } from '@sawt/game'
import { useCopyLink, COPY_ICON, useFitText } from '@sawt/ui'

import SettingsPanel from './SettingsPanel'
import { GameScore, GameActions, ResultsPeek, RaceScore, RacePanel } from './GameHud'
import { Country, hasSound } from './countries/Country'
import { SoundLanguage } from './languages'
import { WorldMap, World, Shape, Tip, CountryState, MapView, distanceToCountry, metricsOf, fitViewOf } from './WorldMap'
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

/*
 * The room a link may have brought this child to. Read once, at load, because
 * joining cleans `?room=` out of the address bar — a value re-derived during a
 * render would disappear the moment the room was entered, taking the lobby's
 * own panel with it.
 */
const INVITED_TO = new URLSearchParams(window.location.search).get('room') ?? undefined

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
	/*
	 * The sound file of a country's name. In the selected language by default —
	 * and in a given one when asked, which is what a courtyard held to the
	 * host's language needs: the same world, spoken in a language this child
	 * did not choose.
	 */
	const countryUrl = (code: string, sound: string = lang) => `/sound/lang/${sound}/${code}.aac`

	/*
	 * Near-miss forgiveness: in the game, a finger aiming at a small country
	 * easily lands on a neighbour or in the sea. A wrong click within
	 * MISS_FORGIVENESS map units of the target (at ×1 — the tolerance shrinks
	 * with the zoom, since finger error is roughly constant on screen) is not
	 * counted: the map zooms in MISS_ZOOM× around the click instead, and the
	 * player tries again. Zooming is centred on the click, never on the
	 * target, so it cannot leak the answer.
	 *
	 * Forgiveness lasts exactly as long as it can still HELP. Each near miss
	 * multiplies the current zoom by MISS_ZOOM, never past MISS_ZOOM_MAX —
	 * from the whole world that is ×1 → ×2 → ×3.9, and from a view already
	 * zoomed (zoom to fit frames a continent at ×5 and more) there is no
	 * step left at all, so the miss counts as the mistake it is. Counting
	 * forgiven misses instead of measuring the zoom was the older rule, and
	 * it forgave twice for free on a map that could not zoom any further:
	 * the player got no closer look and no 👎 either.
	 *
	 * One earth-is-round trap: a country straddling the antimeridian
	 * (Kiribati) has vertices on BOTH edges of the map, so a click at the far
	 * right measures near even when the country's clickable body — its dot —
	 * sits at the far left. Zooming there would strand the player in a view
	 * the target isn't in, so the forgiveness also demands the click be on
	 * the target's side of the world.
	 */
	const MISS_FORGIVENESS = 30
	const MISS_ZOOM = 2
	// the closest the forgiveness will ever take the map — past this it stops
	// forgiving, because a closer look is no longer on offer
	const MISS_ZOOM_MAX = 3.9
	// the forgiveness state remembers its prompt: when the target changes
	// (found, given up) the view snaps back to the whole world without an
	// effect. It is truly cleared on round start — the target-equality guard
	// alone is not enough, because a later round asks the same codes again
	// and a stale zoom would snap back the moment the codes matched (with two
	// countries selected, every other prompt reopened Kiribati pre-zoomed)
	const [miss, setMiss] = useState<{ target: string, view: MapView } | null>(null)

	// the game: find the named country on the map. The board is the map itself,
	// so nothing shuffles — the prompts are random either way.
	// tell sada when the languages change — gated and silent, see @sawt/game
	useSadaSettings('map', settings.uiLanguage, lang)

	const game = useGame<Country>({
		canPlay: world !== null && LANGUAGES.length > 0 && COUNTRIES.length > 0,
		// dealt: only a drawn hand of countries plays and the rest sit out grey;
		// whole: the world stays clickable and the round just stops after N
		buildBoard: () => (settings.dealRound
			? shuffle(COUNTRIES).slice(0, settings.roundLength || COUNTRIES.length)
			: COUNTRIES),
		roundSize: settings.roundLength,
		promptUrl: c => countryUrl(c.code),
		preload: async urls => {
			await ensureCached(urls)
			refreshCacheCount()
		},
		audio,
		// a round is labelled by the language it was played in
		mode: lang,
		app: 'map',
		// a ?room= link opens the app in game mode, so 🏟️ sits where it always
		// does — at the head of the round buttons
		enterOnMount: Boolean(INVITED_TO),
		onRoundStart: () => {
			setSpokenName('')
			setSpokenFlag('')
			setClickedCode(null)
			setMiss(null)
		},
	})

	/*
	 * The courtyard: the same world, but the board, the order and every verdict
	 * come from saha, so that two children — each hearing their own language —
	 * race the very same round.
	 *
	 * Map was the last app to get one, and the first attempt was taken back out
	 * (0.33.0) rather than shipped. What it got wrong is what this one is built
	 * around: the room's board is a *dealt hand* of the round length, so a race
	 * is not an atlas; the near-miss zoom stays, because a map that stops
	 * forgiving reads as a map that got worse; and the prompt is the flag
	 * alone — see the display below.
	 */
	const race = useRace({
		app: 'map',
		// only the countries this child can actually hear right now
		playable: () => [...playable],
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
		onRoundStart: () => {
			setSpokenName('')
			setSpokenFlag('')
			setClickedCode(null)
			setMiss(null)
		},
	})
	// a round is on and the map belongs to it
	const racing = race.on && race.phase !== 'lobby' && race.phase !== 'connecting'
	// whichever round is asking: the room's target, or the solo game's
	const currentTarget = racing ? race.target : game.target

	/*
	 * The language actually being spoken: this child's, unless the room is
	 * being held to the host's. A room held to a language this build does not
	 * have falls back to this child's own rather than fetching a URL nobody
	 * has, which is the same graceful degrade the rest of saha uses.
	 */
	const known = (sound: string | null): SoundLanguage | null =>
		ALL_LANGUAGES.some(l => l.code === sound) ? sound as SoundLanguage : null
	const heard = known(race.sound) ?? lang

	const missActive = miss !== null && (racing || game.gameOn) && miss.target === currentTarget ? miss : null

	/*
	 * Zoom to fit: the map frames only what is in play — the selected
	 * countries while learning, the round's own board in a game (which is the
	 * dealt hand when rounds are dealt, and everything selected otherwise).
	 * The near-miss zoom still wins while it is up, and falls back to this
	 * frame instead of the whole world when it expires.
	 */
	const fitView = useMemo(
		() => {
			if (!settings.zoomToFit || !world) return null
			// in a courtyard the room's board is the hand in play, and it is
			// already visible as one — the rest of the world sits out — so
			// framing it gives nothing away that the map is not showing
			if (racing) return fitViewOf(world, race.board)
			return fitViewOf(world, game.gameOn ? game.board.map(c => c.code) : [...playable])
		},
		[settings.zoomToFit, world, racing, race.board, game.gameOn, game.board, playable],
	)

	/*
	 * What the display segment shows — flag then name: the prompted country
	 * during a round, otherwise the last clicked one. A courtyard reads exactly
	 * as a solo round does, and that is a decision rather than a copy.
	 *
	 * It is the question this app asks and the other seven never had to: what
	 * is a prompt when the board is a world you can already read? Writing the
	 * name does hand something over — whoever knows where Uruguay is can go
	 * straight there without waiting to hear the word. Against that: this app
	 * teaches country *names*, and a race that only ever speaks them teaches
	 * the sound alone; a flag with nothing beside it also reads as a display
	 * that failed rather than a prompt that is deliberately spare. So the name
	 * is written, in both rounds, and the race stays a race about where.
	 *
	 * In a room the name is written in the language being *heard* — this
	 * child's own, unless the host is holding everybody to theirs. A race heard
	 * in Arabic whose display read "Sverige" would hand every answer to whoever
	 * can read.
	 */
	const prompted = racing
		? (race.target !== null ? countryByCode.get(race.target) : undefined)
		: (game.gameOn && game.target !== null
			? game.board.find(c => c.code === game.target)
			: undefined)
	const displayName = prompted ? (prompted.name[racing ? heard : lang] ?? '') : spokenName
	const displayFlag = prompted ? prompted.flag : spokenFlag

	// UI-string translator, following the interface language chosen in settings
	// (independent of the content/country-name language; falls back to English)
	const t = translator(settings.uiLanguage)
	const setUiLanguage = (code: string) => updateSettings({ ...settings, uiLanguage: code as UiLanguage })

	// how each country is drawn on the map right now
	// with a dealt round, everything outside the hand sits out — drawn grey and
	// code-less like untaught land, so it cannot be clicked wrong
	const inRound = useMemo(() => new Set(game.board.map(c => c.code)), [game.board])
	// a courtyard is always a dealt hand: the room's board is the round, and
	// the same one for everybody — which is what keeps a race over two hundred
	// countries an evening's game rather than an atlas
	const inRoom = useMemo(() => new Set(race.board), [race.board])
	const stateOf = useCallback((code: string): CountryState => {
		if (!playable.has(code)) return 'unsupported'
		if (racing) {
			if (!inRoom.has(code)) return 'unsupported'
			if (race.done.includes(code)) return 'correct'
			if (race.wrong.includes(code)) return 'wrong'
			return 'idle'
		}
		if (game.gameOn && settings.dealRound && !inRound.has(code)) return 'unsupported'
		if (game.gameOn) {
			// a given-up code is also in solved, so check it first
			if (game.gaveUpCodes.includes(code)) return 'givenUp'
			if (game.solved.includes(code)) return 'correct'
			if (game.wrongGuesses.includes(code)) return 'wrong'
			return 'idle'
		}
		return code === clickedCode ? 'clicked' : 'idle'
	}, [playable, racing, inRoom, race.done, race.wrong, game.gameOn, settings.dealRound, inRound, game.gaveUpCodes, game.solved, game.wrongGuesses, clickedCode])

	/*
	 * In a courtyard a taken country wears the colour of whoever took it, so a
	 * finished map reads as a record of the race — who reached which corner of
	 * the world — rather than one flat green. A country the room gave up on
	 * belongs to nobody and keeps the ordinary settled fill. saha knows nothing
	 * about any of this: it deals in avatar indices, and the colour is this
	 * app's own reading of index 3.
	 */
	const colorOf = useCallback((code: string): string | undefined => {
		if (!racing) return undefined
		const winner = race.wonByIndex(code)
		return winner === null ? undefined : avatarColor(winner)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [racing, race.done, race.players])

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

	/*
	 * A near miss, as the view to zoom to — or null when this click has to
	 * count. One function for both rounds on purpose: forgiveness is what makes
	 * a small country findable with a finger, and the first courtyard attempt
	 * took it away on the reasoning that being kind to one child is unfair to
	 * the other. Played, the absence read as the map having got worse rather
	 * than fairer — and it was never one-sided anyway: both children get the
	 * same rule, each at their own zoom.
	 */
	const forgive = useCallback((target: string, point: { x: number, y: number }): MapView | null => {
		if (!world) return null
		// what the player is actually looking at: a live miss zoom, else the
		// zoom-to-fit frame, else the whole world
		const shown = missActive?.view ?? fitView
		const scale = world.width / (shown?.w ?? world.width)
		// "correct side": within half a world of the target's main part
		const sameSide = Math.abs(point.x - metricsOf(world, target).x) <= world.width / 2
		// finger error is constant on screen, so the forgiveness radius shrinks
		// with whatever zoom is already in effect
		const near = distanceToCountry(world, target, point.x, point.y) <= MISS_FORGIVENESS / scale
		if (scale >= MISS_ZOOM_MAX || !sameSide || !near) return null
		// one step closer, never past the maximum
		const next = Math.min(scale * MISS_ZOOM, MISS_ZOOM_MAX)
		const x0 = world.x0 ?? 0
		const w = world.width / next
		const h = world.height / next
		return {
			x: Math.min(Math.max(point.x - w / 2, x0), x0 + world.width - w),
			y: Math.min(Math.max(point.y - h / 2, 0), world.height - h),
			w,
			h,
		}
	}, [world, missActive, fitView])

	const onMapClick = useCallback((code: string | null, point: { x: number, y: number } | null) => {
		if (racing) {
			/*
			 * The forgiveness has to decide *before* the tap is sent, never
			 * after: saha locks a player for two seconds on a wrong tap, so a
			 * miss this app forgave but the server heard would be forgiveness
			 * in name only — a closer look arriving together with a freeze.
			 */
			if (point && race.target !== null && code !== race.target) {
				const view = forgive(race.target, point)
				if (view) {
					setMiss({ target: race.target, view })
					return
				}
			}
			if (code && playable.has(code)) race.tap(code)
			return
		}
		if (game.gameOn) {
			// a near miss zooms in for another chance instead of counting
			if (point && game.target !== null && code !== game.target) {
				const view = forgive(game.target, point)
				if (view) {
					setMiss({ target: game.target, view })
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
	}, [playable, racing, race, forgive, game.gameOn, game.target, game.guess, audio, lang, LANGUAGES.length, countryByCode])

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
						disabled={game.target !== null || race.on}
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
				{/*
				  * `colored`: Map fills a won country with the winner's colour,
				  * so the scoreboard is where a child reads which colour is
				  * whose. The other apps tint nothing and leave it off.
				  */}
				{racing && <RaceScore race={race} t={t} colored/>}
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
					colorOf={colorOf}
					tipOf={tipOf}
					nameOf={nameOf}
					onMapClick={onMapClick}
					view={missActive?.view ?? fitView}
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
