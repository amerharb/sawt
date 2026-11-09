import './App.css'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'

import { isVisible } from '@sawt/feature-flags'
import { readUrlParams, writeUrlParams, hiddenFrom } from '@sawt/url-state'
import { useCopyLink, COPY_ICON, useFitText } from '@sawt/ui'
import { useGame, useRace, useSadaSettings, SADA, postFeedback, FeedbackSheet, BAAB, useBaab, BaabSheet, useBaabSettings, preferredAvatar, setPreferredAvatar, usePageLanguage } from '@sawt/game'

import SettingsPanel from './SettingsPanel'
import { GameScore, GameActions, RaceScore, RacePanel } from './GameHud'
import { Settings, DEFAULT_SETTINGS, loadSettings, saveSettings, applyTheme, preferredSound, toSaved, fromSaved } from './settingsStore'
import type { SyncedKey } from './settingsStore'
import { ensureCached, idbCount, idbClear } from './audioCache'
import { useAudio } from './useAudio'
import { translator, languageName, UI_LANGUAGES, uiDirection } from './i18n'
import { Digit, Language, spokenIn } from './digits/Digit'
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
import { d16 } from './digits/16'
import { d17 } from './digits/17'
import { d18 } from './digits/18'
import { d19 } from './digits/19'
import { d20 } from './digits/20'
// past twenty, recorded in English only so far
import { d21 } from './digits/21'
import { d22 } from './digits/22'
import { d23 } from './digits/23'
import { d24 } from './digits/24'
import { d25 } from './digits/25'
import { d26 } from './digits/26'
import { d27 } from './digits/27'
import { d28 } from './digits/28'
import { d29 } from './digits/29'
import { d30 } from './digits/30'
import { d31 } from './digits/31'
import { d32 } from './digits/32'
import { d33 } from './digits/33'
import { d34 } from './digits/34'
import { d35 } from './digits/35'
import { d36 } from './digits/36'
import { d37 } from './digits/37'
import { d38 } from './digits/38'
import { d39 } from './digits/39'
import { d40 } from './digits/40'
import { d41 } from './digits/41'
import { d42 } from './digits/42'
import { d43 } from './digits/43'
import { d44 } from './digits/44'
import { d45 } from './digits/45'
import { d46 } from './digits/46'
import { d47 } from './digits/47'
import { d48 } from './digits/48'
import { d49 } from './digits/49'
import { d50 } from './digits/50'
import { d51 } from './digits/51'
import { d52 } from './digits/52'
import { d53 } from './digits/53'
import { d54 } from './digits/54'
import { d55 } from './digits/55'
import { d56 } from './digits/56'
import { d57 } from './digits/57'
import { d58 } from './digits/58'
import { d59 } from './digits/59'
import { d60 } from './digits/60'
import { d61 } from './digits/61'
import { d62 } from './digits/62'
import { d63 } from './digits/63'
import { d64 } from './digits/64'
import { d65 } from './digits/65'
import { d66 } from './digits/66'
import { d67 } from './digits/67'
import { d68 } from './digits/68'
import { d69 } from './digits/69'
import { d70 } from './digits/70'
import { d71 } from './digits/71'
import { d72 } from './digits/72'
import { d73 } from './digits/73'
import { d74 } from './digits/74'
import { d75 } from './digits/75'
import { d76 } from './digits/76'
import { d77 } from './digits/77'
import { d78 } from './digits/78'
import { d79 } from './digits/79'
import { d80 } from './digits/80'
import { d81 } from './digits/81'
import { d82 } from './digits/82'
import { d83 } from './digits/83'
import { d84 } from './digits/84'
import { d85 } from './digits/85'
import { d86 } from './digits/86'
import { d87 } from './digits/87'
import { d88 } from './digits/88'
import { d89 } from './digits/89'
import { d90 } from './digits/90'
import { d91 } from './digits/91'
import { d92 } from './digits/92'
import { d93 } from './digits/93'
import { d94 } from './digits/94'
import { d95 } from './digits/95'
import { d96 } from './digits/96'
import { d97 } from './digits/97'
import { d98 } from './digits/98'
import { d99 } from './digits/99'
import { d100 } from './digits/100'
import { d1000 } from './digits/1000'
import { d10000 } from './digits/10000'
import { d100000 } from './digits/100000'
import { d1000000 } from './digits/1000000'

// every digit, in ascending order; the code doubles as the sound file name. The
// order matters: `?i=0-9` reads a range as positions in this list, since these
// codes are strings and '10' sorts before '9'
const DIGIT_DEFS: Digit[] = [
	d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10,
	d11, d12, d13, d14, d15, d16, d17, d18, d19, d20,
	d21, d22, d23, d24, d25, d26, d27, d28, d29, d30,
	d31, d32, d33, d34, d35, d36, d37, d38, d39, d40,
	d41, d42, d43, d44, d45, d46, d47, d48, d49, d50,
	d51, d52, d53, d54, d55, d56, d57, d58, d59, d60,
	d61, d62, d63, d64, d65, d66, d67, d68, d69, d70,
	d71, d72, d73, d74, d75, d76, d77, d78, d79, d80,
	d81, d82, d83, d84, d85, d86, d87, d88, d89, d90,
	d91, d92, d93, d94, d95, d96, d97, d98, d99, d100,
	d1000, d10000, d100000, d1000000,
]

/*
 * What a card shows: the number in digits, grouped in threes from a thousand
 * up, so a million reads as one number rather than six zeros to count. The
 * groups are parted by a narrow no-break space, as SI writes them, because a
 * comma or a point marks the thousands in some of these languages and the
 * decimals in others.
 */
const GROUP = '\u202f'
const face = (d: { value: number }) => d.value < 1000
	? String(d.value)
	: d.value.toLocaleString('en-US').replace(/,/g, GROUP)

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
	// the fields a shared link chose on this load, which baab's copy must not
	// undo (see takeFromBaab). Declared ahead of the effect that fills it,
	// which the React Compiler's lint needs before it lets takeFromBaab write
	// to it
	const urlChose = useRef<ReadonlySet<SyncedKey>>(new Set())
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
		urlChose.current = new Set([
			...(url.items ? ['hiddenDigits' as const] : []),
			...(url.sounds ? ['hiddenLanguages' as const] : []),
			...(url.uiLanguage ? ['uiLanguage' as const] : []),
			...(url.theme ? ['theme' as const] : []),
		])

		setSettings(loaded)
		applyTheme(loaded.theme)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// <html lang> follows the interface language (see usePageLanguage)
	usePageLanguage(settings.uiLanguage)

	/*
	 * baab: the family's one sign-in. The session is a cookie for the
	 * whole of sawt.info, so a child who signed in on the landing page is
	 * signed in here with nothing passed between the two — useBaab asks baab
	 * who is behind the cookie, on load and on every return to the tab.
	 * 👤 in ⚙️ shows it and opens the sheet; a magic link, which lands here
	 * when the code was asked for here, opens the sheet by itself to say how
	 * it went. Open to everyone since 0.49.0, as on the landing page, the
	 * privacy notice being there for the sheet to link; VITE_BAAB_ENABLED
	 * alone turns it off, and a build without it neither draws 👤's account
	 * nor asks baab anything.
	 */
	const signIn = BAAB.enabled
	const baab = useBaab('number', signIn)
	const [baabOpen, setBaabOpen] = useState(false)
	const baabShown = baabOpen || baab.arrival !== null
	const closeBaab = () => {
		setBaabOpen(false)
		baab.settle()
	}

	/*
	 * The settings travel with the player: signed in, Number's settings are
	 * kept by baab as well as in localStorage, so the range practised on the
	 * tablet is the range on the laptop too. At sign-in the account's copy
	 * wins; after that every change the player makes is sent, a moment later;
	 * settings taken from baab are not sent back. See useBaabSettings.
	 *
	 * The animal a child is in a courtyard travels with them too. It is the
	 * game package's own setting rather than one of Number's, so it rides
	 * beside them as `avatar`, the index into the twelve.
	 *
	 * Two things hold baab's copy back. A round in play: the board and its
	 * languages cannot change under a child mid-round, so settings arriving
	 * then wait for the round to end. And a shared link: the numbers, sounds,
	 * language and theme it chose stand for this visit.
	 */
	const heldFromBaab = useRef<Record<string, unknown> | null>(null)
	const shared = (s: Settings) => ({ ...toSaved(s), avatar: preferredAvatar() })
	const baabSettings = useBaabSettings('number', baab.session, {
		read: () => shared(settings),
		apply: saved => takeFromBaab(saved),
	})

	// `share` is false for settings that came from baab, which has them
	const updateSettings = (next: Settings, share = true) => {
		// flight mode: download what is (or becomes) visible. Each visible
		// language needs the digits on the board that it has recordings for, plus
		// its language-name sound — read from the settings given, so narrowing the
		// range does not keep caching digits it dropped.
		const soundsFor = (s: Settings) => {
			const digits = ALL_DIGITS.filter(d => !s.hiddenDigits.includes(d.code))
			return ALL_LANGUAGES.filter(l => !s.hiddenLanguages.includes(l.code)).flatMap(l => [
				...digits.filter(d => spokenIn(d, l.code)).map(d => `/sound/lang/${l.code}/${d.code}.aac`),
				`/sound/lang/${l.code}/${l.code}.aac`,
			])
		}
		if (next.flightMode && !settings.flightMode) {
			// just switched on: cache everything currently visible
			cacheAudioUrls(soundsFor(next))
		} else if (next.flightMode) {
			// already on: cache only what just came into view — a language shown
			// again, or numbers put back on the board
			const had = new Set(soundsFor(settings))
			const added = soundsFor(next).filter(url => !had.has(url))
			if (added.length > 0) {
				cacheAudioUrls(added)
			}
		}

		setSettings(next)
		saveSettings(next)
		applyTheme(next.theme)
		if (share) baabSettings.save(shared(next))
	}

	const LANGUAGES = ALL_LANGUAGES.filter(l => !settings.hiddenLanguages.includes(l.code))
	// the selected language object; undefined when every language is hidden
	const lang = LANGUAGES.find(l => l.code === selectedCode)
	// the chosen range, whatever the language — what a share link carries
	const RANGE = ALL_DIGITS.filter(d => !settings.hiddenDigits.includes(d.code))
	// the digits on the board: the range, less those the selected language has
	// no recording for — past twenty, every language but English
	const DIGITS = lang ? RANGE.filter(d => spokenIn(d, lang.code)) : RANGE

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
		// a ?room= link opens the app in game mode, so 🏟️ sits where it
		// always does — at the head of the round buttons
		enterOnMount: Boolean(INVITED_TO),
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
	/*
	 * The feedback sheet, opened from ⚙️. Only offered when there is a
	 * collector to send to — with sada off, the button is not drawn at all,
	 * the same way 🏟️ does not appear without saha.
	 */
	const [feedbackOpen, setFeedbackOpen] = useState(false)

	const t = translator(settings.uiLanguage)
	const setUiLanguage = (code: string) => updateSettings({ ...settings, uiLanguage: code })

	// content languages as { code, display } with names in the UI language,
	// sorted alphabetically by that display name (using the UI language's collation)
	const localizedContent = (list: { code: string, display: string }[]) => list
		.map(l => ({ code: l.code, display: languageName(t, l.code, l.display) }))
		.sort((a, b) => a.display.localeCompare(b.display, settings.uiLanguage))

	// a link that reproduces what is on screen: the digit range, the visible
	// languages with the selected one first, the interface language and the
	// theme. The range is the one chosen, not the board, so a link copied in
	// Swedish does not hide the numbers only English has
	const shareUrl = () => window.location.origin + window.location.pathname + writeUrlParams({
		items: { all: ALL_DIGITS.map(d => d.code), visible: RANGE.map(d => d.code), asRange: true },
		sounds: {
			all: ALL_LANGUAGES.map(l => l.code),
			visible: [selectedCode, ...LANGUAGES.map(l => l.code).filter(c => c !== selectedCode)],
		},
		uiLanguage: settings.uiLanguage,
		theme: settings.theme,
	})

	// baab's settings, laid over this page's — or held while a round is on
	const roundLocked = game.roundOn || race.on
	const takeFromBaab = (saved: Record<string, unknown>) => {
		// the animal is read when a room is opened or joined, never mid-round,
		// so it needs no waiting; an index this build lacks is passed over
		if (typeof saved.avatar === 'number') setPreferredAvatar(saved.avatar)
		if (roundLocked) {
			heldFromBaab.current = saved
			return
		}
		const next = fromSaved(saved, settings, {
			uiLanguages: UI_LANGUAGES.map(l => l.code),
			languages: ALL_LANGUAGES.map(l => l.code),
			digits: ALL_DIGITS.map(d => d.code),
		}, urlChose.current)
		urlChose.current = new Set()
		updateSettings(next, false)
	}
	useEffect(() => {
		if (roundLocked || heldFromBaab.current === null) return
		const saved = heldFromBaab.current
		heldFromBaab.current = null
		takeFromBaab(saved)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roundLocked])

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
						disabled={game.roundOn || race.roundOn}
						onChange={(e) => handleLanguageChange(e.target.value)}
					>
						{localizedContent(LANGUAGES).map(l => (
							<option key={`lang-${l.code}`} value={l.code}>{l.display}</option>
						))}
					</select>
					<SettingsPanel
						settings={settings}
						languages={localizedContent(ALL_LANGUAGES)}
						digits={ALL_DIGITS.map(d => ({ code: d.code, face: face(d) }))}
						shareUrl={shareUrl}
						caching={caching}
						cachedCount={cachedCount}
						locked={game.roundOn || race.on}
						t={t}
						uiLanguage={settings.uiLanguage}
						uiLanguages={UI_LANGUAGES}
						onSetUiLanguage={setUiLanguage}
						onChange={updateSettings}
						onClearCache={clearSoundCache}
						onFeedback={SADA.enabled ? () => setFeedbackOpen(true) : undefined}
						account={signIn ? baab : undefined}
						onSignIn={signIn ? () => setBaabOpen(true) : undefined}
						onAvatar={() => baabSettings.save(shared(settings))}
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
							onReplay: () => race.target && audio.play(numberUrl(race.target, heard ?? undefined)),
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
							className={'button-number' + (n.value >= 1000 ? ' wide' : '') + (audio.playingCode === n.code ? ' playing' : '') + (isWrong ? ' wrong' : '')}
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
									setSpelledNumber(n.name[lang.code] ?? '')
								}
							}}
						>
							{face(n)}
							{audio.playingCode === n.code && <span className="play-icon">▶</span>}
							{/*
							  * A settled card wears its winner: 👍 at the top right, the
							  * animal of whoever got there first at the top left. In a
							  * courtyard a card can also settle with nobody winning it —
							  * the room voted it away, or it timed out — and that one
							  * gets 🤷‍♂️ and no animal, the same as giving up alone.
							  */}
							{isSolved && racing && race.wonBy(n.code) && (
								<span className="swatch-winner avatar-glyph">{race.wonBy(n.code)}</span>
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
			{feedbackOpen && (
				<FeedbackSheet
					t={t}
					// the sheet reads in the interface language's direction
					dir={uiDirection(settings.uiLanguage)}
					uiLanguages={UI_LANGUAGES}
					sounds={localizedContent(ALL_LANGUAGES)}
					items={ALL_DIGITS.map(d => ({ code: d.code, label: d.code, node: <span>{face(d)}</span> }))}
					context={{ version: __APP_VERSION__, uiLanguage: settings.uiLanguage, sound: selectedCode }}
					onSend={(kind, info) => postFeedback('number', kind, info)}
					onClose={() => setFeedbackOpen(false)}
				/>
			)}
			{signIn && baabShown && (
				<BaabSheet t={t} dir={uiDirection(settings.uiLanguage)} language={settings.uiLanguage} baab={baab} onClose={closeBaab}/>
			)}
			<Analytics/>
		</div>
	)
}

export default App
