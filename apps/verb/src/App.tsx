import './App.css'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'

import { isVisible } from '@sawt/feature-flags'
import { shuffle, sortByCodeOrName } from '@sawt/order'
import { readUrlParams, writeUrlParams, hiddenFrom } from '@sawt/url-state'
import { useGame, useRace, useSadaSettings } from '@sawt/game'
import { useCopyLink, COPY_ICON, useFitText } from '@sawt/ui'

import SettingsPanel from './SettingsPanel'
import { GameScore, GameActions, ResultsPeek, RaceScore, RacePanel } from './GameHud'
import { Verb, Language } from './verbs/Verb'
import { Scene, SCENES, MOMENTS, MOMENT_ICONS, FALLBACK } from './moments'
import {
	Settings,
	SortMode,
	DEFAULT_SETTINGS,
	loadSettings,
	saveSettings,
	applyTheme,
	preferredSound,
} from './settingsStore'
import { ensureCached, getAudioBlob, idbCount, idbClear } from './audioCache'
import { useAudio } from './useAudio'
import { translator, languageName, UI_LANGUAGES, UiLanguage } from './i18n'
import { cut } from './verbs/cut'
import { eat } from './verbs/eat'
import { listen } from './verbs/listen'
import { paint } from './verbs/paint'
import { raisehand } from './verbs/raisehand'
import { share } from './verbs/share'
import { swim } from './verbs/swim'

// the animation of a verb at one moment, hand-drawn SVG (see public/anim/)
const animUrl = (code: string, scene: Scene) => `/anim/${code}.${scene}.svg`

/*
 * The room a link may have brought this child to. Read once, at load, because
 * joining cleans `?room=` out of the address bar — a value re-derived during a
 * render would disappear the moment the room was entered, taking the lobby's
 * own panel with it.
 */
const INVITED_TO = new URLSearchParams(window.location.search).get('room') ?? undefined

function App() {
	// everything the build supports (after the beta feature flag)
	const ALL_VERBS: Verb[] = [cut, eat, listen, paint, raisehand, share, swim].filter(isVisible)
	const LANGUAGE_DEFS: { code: Language, display: string, beta?: boolean }[] = [
		{ code: 'en', display: 'English' },
		{ code: 'ar', display: 'عربي' },
		{ code: 'de', display: 'Deutsch' },
		{ code: 'sv', display: 'Svenska' },
	]
	const ALL_LANGUAGES = LANGUAGE_DEFS.filter(isVisible)

	// true while flight-mode downloads are in progress, to show it on the toggle
	const [caching, setCaching] = useState(false)
	// how many files (sounds + animations) are in the cache, shown in settings
	const [cachedCount, setCachedCount] = useState(0)

	const refreshCacheCount = useCallback(async () => {
		try {
			setCachedCount(await idbCount())
		} catch {
			// leave the previous count
		}
	}, [])
	// the selected sound: the language the verb is spoken in. Declared above
	// the settings effect, which sets it from a ?s= parameter.
	const [lang, setLang] = useState<Language>(() => preferredSound())

	/*
	 * The selected moment — which point in time the verbs speak (❗ ⏳ ⏪ ⌛).
	 * This is what the user asked for; what the app shows is `moment` below,
	 * derived per language: Arabic has no play-once past, so a request for
	 * `did` falls to `done` there — usually the same picture with the new
	 * word — and comes back when the language changes again.
	 */
	const [wantedMoment, setWantedMoment] = useState<Scene>('doing')
	const moments = MOMENTS[lang]
	const moment: Scene = moments.includes(wantedMoment)
		? wantedMoment
		: (FALLBACK[wantedMoment].find(s => moments.includes(s)) ?? 'doing')

	useEffect(() => {
		refreshCacheCount()
	}, [refreshCacheCount])

	// playback, mute and the feedback sounds
	const audio = useAudio(refreshCacheCount)

	/*
	 * The animations — every verb × every scene — served from the same cache
	 * as the sounds (the way Map treats its world.json): the first visit
	 * stores them, and from then on the <img>s read object URLs of the cached
	 * blobs — so ✈️ keeps the animations working offline too. Until a blob
	 * arrives the <img> falls back to the network path. The blobs stay in a
	 * ref so a `did` card can mint a fresh URL on tap, which is what replays
	 * its play-once animation.
	 */
	const [animSrc, setAnimSrc] = useState<Record<string, string>>({})
	const animBlobs = useRef(new Map<string, Blob>())
	useEffect(() => {
		let cancelled = false
		const jobs = ALL_VERBS.flatMap(v => SCENES.map(async scene => {
			const key = `${v.code}.${scene}`
			const url = animUrl(v.code, scene)
			const blob = await getAudioBlob(url)
			if (!blob) return [key, url] as const
			// an SVG blob only renders in an <img> if its type says so
			const svg = blob.type ? blob : new Blob([blob], { type: 'image/svg+xml' })
			animBlobs.current.set(key, svg)
			return [key, URL.createObjectURL(svg)] as const
		}))
		Promise.all(jobs).then(entries => {
			if (cancelled) return
			setAnimSrc(Object.fromEntries(entries))
			refreshCacheCount()
		})
		return () => {
			cancelled = true
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// a did animation plays once and rests — a fresh object URL restarts it
	const replayDid = (code: string) => {
		const key = `${code}.did`
		const blob = animBlobs.current.get(key)
		if (!blob) return
		setAnimSrc(prev => {
			const old = prev[key]
			if (old?.startsWith('blob:')) URL.revokeObjectURL(old)
			return { ...prev, [key]: URL.createObjectURL(blob) }
		})
	}

	// user settings (theme + which languages/verbs to show on the main screen)
	const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
	useEffect(() => {
		let loaded = loadSettings()

		// URL parameters for a shareable deep link — see the README. Anything
		// unusable is ignored rather than applied, so a mistyped code cannot leave
		// the app blank.
		const url = readUrlParams(window.location.search, {
			items: ALL_VERBS.map(v => v.code),
			sounds: ALL_LANGUAGES.map(l => l.code),
			uiLanguages: UI_LANGUAGES.map(l => l.code),
		})
		if (url.items) {
			loaded = { ...loaded, hiddenVerbs: hiddenFrom(ALL_VERBS.map(v => v.code), url.items) }
		}
		if (url.sounds) {
			loaded = { ...loaded, hiddenLanguages: hiddenFrom(ALL_LANGUAGES.map(l => l.code), url.sounds) as Language[] }
			setLang(url.sounds[0] as Language) // first listed = selected
		}
		if (url.uiLanguage) loaded = { ...loaded, uiLanguage: url.uiLanguage as typeof loaded.uiLanguage }
		if (url.theme) loaded = { ...loaded, theme: url.theme }

		// ?m= — the moment, validated like everything else; per-language
		// availability is handled by the derivation above
		const m = new URLSearchParams(window.location.search).get('m')
		if (m && (SCENES as string[]).includes(m)) {
			setWantedMoment(m as Scene)
		}

		setSettings(loaded)
		applyTheme(loaded.theme)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const [name, setName] = useState('')

	// delete only the downloaded files (settings stay); not allowed in flight mode
	const clearSoundCache = useCallback(async () => {
		try {
			await idbClear()
		} catch {
			// ignore
		}
		setCachedCount(0)
	}, [])

	// Flight mode: download the given files into the cache, showing the busy state.
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
		// stop playback when its verb, or the selected language, just got hidden —
		// otherwise the sound would keep playing with no button left to stop it
		if (
			(audio.playingCode && next.hiddenVerbs.includes(audio.playingCode)) ||
			next.hiddenLanguages.includes(lang)
		) {
			audio.stopSound()
		}

		// flight mode: download what is (or becomes) visible — every moment the
		// language distinguishes, and every scene of every visible verb
		const visibleLangs = ALL_LANGUAGES.filter(l => !next.hiddenLanguages.includes(l.code))
		const visibleVerbs = ALL_VERBS.filter(v => !next.hiddenVerbs.includes(v.code))
		const urlsFor = (langs: typeof visibleLangs, verbs: typeof visibleVerbs) =>
			langs.flatMap(l => MOMENTS[l.code].flatMap(scene =>
				verbs.map(v => `/sound/lang/${l.code}/${scene}/${v.code}.aac`)))
		const animsFor = (verbs: typeof visibleVerbs) =>
			verbs.flatMap(v => SCENES.map(scene => animUrl(v.code, scene)))
		if (next.flightMode && !settings.flightMode) {
			// just switched on: cache everything currently visible
			cacheAudioUrls([...urlsFor(visibleLangs, visibleVerbs), ...animsFor(visibleVerbs)])
		} else if (next.flightMode) {
			// already on: cache only what just became visible
			const newLangs = visibleLangs.filter(l => settings.hiddenLanguages.includes(l.code))
			const newVerbs = visibleVerbs.filter(v => settings.hiddenVerbs.includes(v.code))
			const oldLangs = visibleLangs.filter(l => !settings.hiddenLanguages.includes(l.code))
			const urls = [
				...urlsFor(newLangs, visibleVerbs),
				...urlsFor(oldLangs, newVerbs),
				...animsFor(newVerbs),
			]
			if (urls.length > 0) {
				cacheAudioUrls(urls)
			}
		}

		setSettings(next)
		saveSettings(next)
		applyTheme(next.theme)
	}

	// choose a sort mode for the verbs; choosing random reshuffles every time
	const setSort = (mode: SortMode) => {
		if (mode === 'random') {
			updateSettings({ ...settings, sortMode: 'random', randomOrder: shuffle(ALL_VERBS.map(v => v.code)) })
		} else {
			updateSettings({ ...settings, sortMode: mode })
		}
	}

	const LANGUAGES = ALL_LANGUAGES.filter(l => !settings.hiddenLanguages.includes(l.code))
	// a verb's word right now: the selected language at the selected moment
	const wordOf = (v: Verb) => v.name[lang][moment] ?? ''
	// what the main screen actually shows: all verbs sorted by the chosen mode,
	// then filtered to the visible ones (hidden verbs still hold their sorted slot)
	const VERBS = sortByCodeOrName(ALL_VERBS, {
		mode: settings.sortMode,
		randomOrder: settings.randomOrder,
		// no visible language means there is no name to sort by — fall back to code
		nameOf: LANGUAGES.length > 0 ? wordOf : undefined,
		locale: lang,
	})
		.filter(v => !settings.hiddenVerbs.includes(v.code))

	// if the selected language gets hidden in settings, fall back to the first visible one
	useEffect(() => {
		if (LANGUAGES.length > 0 && !LANGUAGES.some(l => l.code === lang)) {
			setLang(LANGUAGES[0].code)
			setName('')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings.hiddenLanguages])

	/*
	 * What a courtyard can hold everyone to, as one id. This app's sound is a
	 * language *and* a moment — "find the verb" in Arabic at the ⌛ done scene
	 * is a different game from the same board in Swedish at ❗ do! — and saha's
	 * ids are lowercase letters, digits and hyphens, so the pair travels as
	 * `ar-done` and is read back through this app's own lists rather than
	 * trusted as it arrives. An id naming a moment a language does not have
	 * (Arabic has no ⏪ did) resolves to nothing, exactly like an unknown one.
	 */
	const soundId = `${lang}-${moment}`
	const known = (id: string | null): { lang: Language, moment: Scene } | null => {
		const [code, scene] = (id ?? '').split('-')
		const language = ALL_LANGUAGES.find(l => l.code === code)?.code
		const found = SCENES.find(s => s === scene)
		return language && found && MOMENTS[language].includes(found)
			? { lang: language, moment: found }
			: null
	}

	// the sound of a verb: the selected language and moment, or a room's own
	const soundUrl = (code: string, sound: string = soundId) => {
		const spoken = known(sound) ?? { lang, moment }
		return `/sound/lang/${spoken.lang}/${spoken.moment}/${code}.aac`
	}

	// the game: the verbs shuffle on every round — only the prompts are random too
	// tell sada when the languages change — gated and silent, see @sawt/game
	useSadaSettings('verb', settings.uiLanguage, lang)

	const game = useGame<Verb>({
		canPlay: LANGUAGES.length > 0 && VERBS.length > 0,
		buildBoard: () => shuffle(VERBS),
		promptUrl: v => soundUrl(v.code),
		preload: async urls => {
			await ensureCached(urls)
			refreshCacheCount()
		},
		audio,
		// a round is labelled by the language and moment it was played in
		mode: `${lang}:${moment}`,
		app: 'verb',
		onRoundStart: () => setName(''),
	})

	/*
	 * The courtyard: the same verbs, but the board, the order and every verdict
	 * come from saha, so that two children — each hearing their own language at
	 * their own moment — race the very same round. It sits beside the solo game
	 * rather than inside it; whichever one is on decides what the cards do.
	 */
	const race = useRace({
		app: 'verb',
		// only what this child can actually hear right now
		playable: () => VERBS.map(v => v.code),
		promptUrl: soundUrl,
		preload: async urls => {
			await ensureCached(urls)
			refreshCacheCount()
		},
		audio,
		// the same label the solo round carries, posted as `race:<language>:<moment>`
		mode: `${lang}:${moment}`,
		// the pair this child is set to — what a host may hold a room to
		sound: soundId,
		onRoundStart: () => setName(''),
	})
	// a round is on and the cards belong to it
	const racing = race.on && race.phase !== 'lobby' && race.phase !== 'connecting'
	const byCode = (code: string) => ALL_VERBS.find(v => v.code === code)

	/*
	 * What is actually being spoken, and therefore shown: this child's pair,
	 * unless the room is being held to the host's. The pictures follow it as
	 * well as the words, because a room held to ⌛ done is playing the done
	 * game — a child hearing "has eaten" over an anticipation animation would
	 * be somewhere else entirely. A pair this build cannot read falls back to
	 * this child's own, the same graceful degrade the rest of saha uses.
	 */
	const spoken = known(race.sound) ?? { lang, moment }
	const heardWord = (v: Verb) => v.name[spoken.lang][spoken.moment] ?? ''

	const board = racing
		? race.board.map(byCode).filter((v): v is Verb => v !== undefined)
		: (game.gameOn ? game.board : VERBS)

	// what a card is, right now: solo game, race, or just a verb to hear
	const solved = racing ? race.done : game.solved
	const wrongs = racing ? race.wrong : game.wrongGuesses
	const currentTarget = racing ? race.target : game.target
	const feedback = racing ? race.feedback : game.feedback
	// what the display segment shows: the prompted word during a round (so the
	// game is playable while muted), otherwise the last clicked word. In a
	// courtyard it is the word being spoken, which is not always this child's
	const displayText = currentTarget !== null && (game.gameOn || racing)
		? (() => {
			const target = byCode(currentTarget)
			return target ? (racing ? heardWord(target) : wordOf(target)) : ''
		})()
		: name

	// UI-string translator, following the interface language chosen in settings
	// (independent of the content/verb language; falls back to English)
	const t = translator(settings.uiLanguage)
	const setUiLanguage = (code: string) => updateSettings({ ...settings, uiLanguage: code as UiLanguage })

	// content languages as { code, display } with names in the UI language,
	// sorted alphabetically by that display name (using the UI language's collation)
	const localizedContent = (list: { code: Language, display: string }[]) => list
		.map(l => ({ code: l.code, display: languageName(t, l.code, l.display) }))
		.sort((a, b) => a.display.localeCompare(b.display, settings.uiLanguage))

	// a link that reproduces what is on screen: the visible verbs, the visible
	// languages with the selected one first, the moment, the interface language
	// and the theme
	const shareUrl = () => {
		const qs = writeUrlParams({
			items: { all: ALL_VERBS.map(v => v.code), visible: VERBS.map(v => v.code) },
			sounds: {
				all: ALL_LANGUAGES.map(l => l.code),
				visible: [lang, ...LANGUAGES.map(l => l.code).filter(c => c !== lang)],
			},
			uiLanguage: settings.uiLanguage,
			theme: settings.theme,
		})
		const base = window.location.origin + window.location.pathname + qs
		if (moment === 'doing') return base
		return base + (qs.includes('?') ? '&' : '?') + 'm=' + moment
	}

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
			 * A room's pair, named in this child's own interface language: the
			 * language spelled out and the moment as the very icon that sits on
			 * the switch above. Read through this app's own lists, so an id from
			 * a build that knows something this one does not resolves to nothing
			 * rather than to a word nobody vouched for.
			 */
			soundName={id => {
				const pair = known(id)
				const found = pair && ALL_LANGUAGES.find(l => l.code === pair.lang)
				return found && pair
					? `${languageName(t, found.code, found.display)} ${MOMENT_ICONS[pair.moment]}`
					: ''
			}}
		/>
	)

	// shrink the display font before falling back to the marquee
	const displayRef = useFitText(displayText)

	return (
		<div className="Verb">
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
					{/* the moment switch: locked during a round like the language,
					    so the prompt and the board cannot drift apart */}
					<div className="moment-switch" role="group" aria-label={t('group.moments')}>
						{moments.map(s => (
							<button
								key={`moment-${s}`}
								type="button"
								className={moment === s ? 'segment selected' : 'segment'}
								aria-pressed={moment === s}
								aria-label={t(`moment.${s}`)}
								title={t(`moment.${s}`)}
								disabled={game.target !== null || race.on}
								onClick={() => {
									setWantedMoment(s)
									setName('')
									audio.stopSound()
								}}
							>
								{MOMENT_ICONS[s]}
							</button>
						))}
					</div>
					<select
						className="language-select"
						title={t('lang.title')}
						value={lang}
						disabled={game.target !== null || race.on}
						onChange={(e) => {
							setLang(e.target.value as Language)
							setName('')
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
						verbs={ALL_VERBS.map(v => ({ code: v.code, emoji: v.emoji }))}
						caching={caching}
						cachedCount={cachedCount}
						locked={game.gameOn || race.on}
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
						onReplay={() => race.target && audio.play(soundUrl(race.target, race.sound ?? soundId))}
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
				{board.map(v => {
					/*
					 * A solo round's 🤷‍♂️ is the solo round's alone: it outlives the
					 * round that made it (nothing clears it until the next one
					 * starts), so without this guard a child who gave up on "swim"
					 * and then opened a courtyard would find it greyed out — and
					 * unwinnable when the room asked for it. A courtyard's
					 * given-up cards arrive with the board instead.
					 */
					const isGivenUp = !racing && game.gameOn && game.gaveUpCodes.includes(v.code)
					const isSolved = (racing || game.gameOn) && solved.includes(v.code) && !isGivenUp
					const isWrong = (racing || game.gameOn) && wrongs.includes(v.code)
					return (
						<button
							key={`verb-${v.code}`}
							className={'button-verb' + (audio.playingCode === v.code ? ' playing' : '') + (isWrong ? ' wrong' : '')}
							title={(game.gameOn || racing) ? '' : (LANGUAGES.length > 0 ? wordOf(v) : '🤷‍♂️')}
							disabled={isSolved || isGivenUp || isWrong}
							onClick={() => {
								// a did animation rests once played — tapping runs it again
								if (spoken.moment === 'did') {
									replayDid(v.code)
								}
								if (racing) {
									race.tap(v.code)
								} else if (game.gameOn) {
									game.guess(v.code)
								} else if (audio.playingCode === v.code) {
									audio.stopSound()
								} else if (LANGUAGES.length === 0) {
									// every language is hidden: nothing to say
									setName('🤷‍♂️')
								} else {
									setName(wordOf(v))
									audio.play(soundUrl(v.code), v.code)
								}
							}}
						>
							<img
								className="verb-anim"
								src={animSrc[`${v.code}.${spoken.moment}`] ?? animUrl(v.code, spoken.moment)}
								alt=""
								draggable={false}
							/>
							{audio.playingCode === v.code && <span className="play-icon">▶</span>}
							{/*
							  * A settled card wears its winner: 👍 at the top right, the
							  * animal of whoever got there first at the top left. In a
							  * courtyard a card can also settle with nobody winning it —
							  * the room voted it away, or it timed out — and that one
							  * gets 🤷‍♂️ and no animal, the same as giving up alone.
							  */}
							{isSolved && racing && race.wonBy(v.code) && (
								<span className="swatch-winner">{race.wonBy(v.code)}</span>
							)}
							{isSolved && (
								<span className="swatch-mark">
									{racing && !race.wonBy(v.code) ? '🤷‍♂️' : '👍'}
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
