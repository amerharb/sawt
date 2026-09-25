import { useEffect, useRef, useState } from 'react'
import { useCopyLink, COPY_ICON, COPY_TITLE } from '@sawt/ui'
import { Language } from './dinos/Dino'
import { isVisible } from '@sawt/feature-flags'
import { Theme, SortMode, BoardArt, Settings } from './settingsStore'
import { AvatarSetting } from '@sawt/game'

// structural type so this stays app-agnostic (no import from i18n)
type Translate = (key: string) => string

const THEME_OPTIONS: { value: Theme, icon: string, key: string }[] = [
	{ value: 'system', icon: '🖥️', key: 'theme.system' },
	{ value: 'light', icon: '☀️', key: 'theme.light' },
	{ value: 'dark', icon: '🌙', key: 'theme.dark' },
]

// what the cards are drawn with. Not 'realistic' and 'cartoon': the
// silhouette is the more accurate of them, being a traced outline. The
// Ghibli set is beta until every animal has a picture — a style with a gap
// in it would put a blank card in front of a child
const ART_ALL: { value: BoardArt, icon: string, key: string, beta?: boolean }[] = [
	{ value: 'painting', icon: '🖼️', key: 'art.painting' },
	{ value: 'ghibli', icon: '🎨', key: 'art.ghibli', beta: true },
	{ value: 'silhouette', icon: '✏️', key: 'art.silhouette' },
]
const ART_OPTIONS = ART_ALL.filter(isVisible)

const SORT_OPTIONS: { value: SortMode, icon: string, key: string }[] = [
	{ value: 'code', icon: '🙂', key: 'sort.code' },
	{ value: 'name', icon: '🔤', key: 'sort.name' },
	{ value: 'random', icon: '🎲', key: 'sort.random' },
]

/*
 * Three tabs, as Colour's panel has: 👁️ what you see, 👂 what you hear, 🕹️ the
 * game. Which dinosaurs are on the board is a question about what you see, so that
 * list sits under 👁️ beside the order they are shown in.
 */
const TABS = [
	{ id: 'see', icon: '👁️', key: 'tab.see' },
	{ id: 'hear', icon: '👂', key: 'tab.hear' },
	{ id: 'play', icon: '🕹️', key: 'tab.play' },
] as const

type TabId = typeof TABS[number]['id']

type Props = {
	settings: Settings,
	// full (beta-filtered) lists, so the checklists always show everything supported
	languages: { code: Language, display: string }[],
	dinos: { code: string, src: string }[],
	// true while flight-mode downloads are running
	caching: boolean,
	// number of sound files currently in the cache
	cachedCount: number,
	// while a round is on (or a room is open), the language and dinosaur lists can't be changed; between rounds they can
	locked: boolean,
	// UI-string translator (falls back to English)
	t: Translate,
	// the current interface language and the options for its dropdown
	uiLanguage: string,
	uiLanguages: { code: string, display: string }[],
	onSetUiLanguage: (code: string) => void,
	onChange: (settings: Settings) => void,
	onSetSort: (mode: SortMode) => void,
	onClearCache: () => void,
	// the share link for the current settings, built when the button is pressed so
	// it always reflects what is on screen now
	shareUrl: () => string,
}

export default function SettingsPanel({ settings, languages, dinos, caching, cachedCount, locked, t, uiLanguage, uiLanguages, onSetUiLanguage, onChange, onSetSort, onClearCache, shareUrl }: Readonly<Props>) {
	const [open, setOpen] = useState(false)
	// the panel closes and reopens on the tab it was left on
	const [tab, setTab] = useState<TabId>('see')
	const { status: copyStatus, copy } = useCopyLink()
	const containerRef = useRef<HTMLDivElement | null>(null)

	// close the panel when clicking anywhere outside it
	useEffect(() => {
		if (!open) return
		const handleOutside = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setOpen(false)
			}
		}
		document.addEventListener('mousedown', handleOutside)
		return () => document.removeEventListener('mousedown', handleOutside)
	}, [open])

	const setTheme = (theme: Theme) => onChange({ ...settings, theme })
	const setBoardArt = (boardArt: BoardArt) => onChange({ ...settings, boardArt })

	const toggleLanguage = (code: Language) => {
		const hiddenLanguages = settings.hiddenLanguages.includes(code)
			? settings.hiddenLanguages.filter(c => c !== code)
			: [...settings.hiddenLanguages, code]
		onChange({ ...settings, hiddenLanguages })
	}

	const toggleDino = (code: string) => {
		const hiddenDinos = settings.hiddenDinos.includes(code)
			? settings.hiddenDinos.filter(c => c !== code)
			: [...settings.hiddenDinos, code]
		onChange({ ...settings, hiddenDinos })
	}

	const showAllLanguages = () => onChange({ ...settings, hiddenLanguages: [] })
	const hideAllLanguages = () => onChange({ ...settings, hiddenLanguages: languages.map(l => l.code) })
	const showAllDinos = () => onChange({ ...settings, hiddenDinos: [] })
	const hideAllDinos = () => onChange({ ...settings, hiddenDinos: dinos.map(d => d.code) })

	return (
		<div className="settings" ref={containerRef}>
			<button
				type="button"
				className={open ? 'settings-button open' : 'settings-button'}
				aria-label={t('settings.title')}
				aria-expanded={open}
				title={t('settings.title')}
				onClick={() => setOpen(o => !o)}
			>
				⚙️
			</button>

			{open && (
				<div className="settings-panel" role="dialog" aria-label={t('settings.title')}>
					<div className="settings-tabs" role="tablist" aria-label={t('settings.title')}>
						{TABS.map(item => (
							<button
								key={item.id}
								type="button"
								role="tab"
								id={`settings-tab-${item.id}`}
								aria-selected={tab === item.id}
								aria-controls={`settings-panel-${item.id}`}
								className={tab === item.id ? 'settings-tab on' : 'settings-tab'}
								aria-label={t(item.key)}
								title={t(item.key)}
								onClick={() => setTab(item.id)}
							>
								{item.icon}
							</button>
						))}
					</div>

					{tab === 'see' && (
						<div className="settings-tabpanel" role="tabpanel" id="settings-panel-see" aria-labelledby="settings-tab-see">
							<div className="settings-row">
								<div className="settings-segmented" role="group" aria-label={t('group.theme')}>
									{THEME_OPTIONS.map(opt => (
										<button
											key={opt.value}
											type="button"
											className={settings.theme === opt.value ? 'segment selected' : 'segment'}
											aria-pressed={settings.theme === opt.value}
											aria-label={t(opt.key)}
											title={t(opt.key)}
											onClick={() => setTheme(opt.value)}
										>
											{opt.icon}
										</button>
									))}
								</div>
							</div>

							<div className="settings-row">
								<label className="settings-uilang">
									<select
										className="language-select"
										aria-label={t('uiLanguage')}
										title={t('uiLanguage')}
										value={uiLanguage}
										onChange={(e) => onSetUiLanguage(e.target.value)}
									>
										{uiLanguages.map(l => (
											<option key={`ui-${l.code}`} value={l.code}>{l.display}</option>
										))}
									</select>
								</label>
							</div>

							<div className="settings-row">
								<div className="settings-segmented" role="group" aria-label={t('group.sort')}>
									<span className="settings-segmented-icon" aria-hidden="true">⇵</span>
									{SORT_OPTIONS.map(opt => (
										<button
											key={opt.value}
											type="button"
											className={settings.sortMode === opt.value ? 'segment selected' : 'segment'}
											aria-pressed={settings.sortMode === opt.value}
											aria-label={t(opt.key)}
											title={t(opt.key)}
											onClick={() => onSetSort(opt.value)}
										>
											{opt.icon}
										</button>
									))}
								</div>
							</div>

							{/* the painting or the silhouette: what each card is drawn with */}
							<div className="settings-row">
								<div className="settings-segmented" role="group" aria-label={t('group.art')}>
									{ART_OPTIONS.map(opt => (
										<button
											key={opt.value}
											type="button"
											className={settings.boardArt === opt.value ? 'segment selected' : 'segment'}
											aria-pressed={settings.boardArt === opt.value}
											aria-label={t(opt.key)}
											title={t(opt.key)}
											onClick={() => setBoardArt(opt.value)}
										>
											{opt.icon}
										</button>
									))}
								</div>
							</div>

							{/* which dinosaurs are on the board is a question about what you see */}

							<div className="settings-row">
								<div className="settings-select-all">
									<button
										type="button"
										aria-label={t('selectAllDinos')}
										title={t('selectAll')}
										disabled={locked}
										onClick={showAllDinos}
									>
									✅
									</button>
									<button
										type="button"
										aria-label={t('deselectAllDinos')}
										title={t('deselectAll')}
										disabled={locked}
										onClick={hideAllDinos}
									>
									⬜
									</button>
								</div>
								<div className="settings-dino-grid" role="group" aria-label={t('group.dinos')}>
									{dinos.map(d => {
										const shown = !settings.hiddenDinos.includes(d.code)
										return (
											<button
												key={`setting-dino-${d.code}`}
												type="button"
												className={shown ? 'dino-toggle' : 'dino-toggle hidden'}
												aria-pressed={shown}
												aria-label={d.code}
												title={d.code}
												disabled={locked}
												onClick={() => toggleDino(d.code)}
											>
												{/* the drawing itself, small — there is no emoji for a
												    triceratops, and a stand-in would name it wrongly */}
												<img className="dino-chip" src={d.src} alt="" draggable={false}/>
											</button>
										)
									})}
								</div>
							</div>
						</div>
					)}

					{tab === 'hear' && (
						<div className="settings-tabpanel" role="tabpanel" id="settings-panel-hear" aria-labelledby="settings-tab-hear">
							<div className="settings-row">
								<div className="settings-select-all">
									<button
										type="button"
										aria-label={t('selectAllLanguages')}
										title={t('selectAll')}
										disabled={locked}
										onClick={showAllLanguages}
									>
									✅
									</button>
									<button
										type="button"
										aria-label={t('deselectAllLanguages')}
										title={t('deselectAll')}
										disabled={locked}
										onClick={hideAllLanguages}
									>
									⬜
									</button>
								</div>
								<div className="settings-checklist" role="group" aria-label={t('group.languages')}>
									{languages.map(l => {
										const shown = !settings.hiddenLanguages.includes(l.code)
										return (
											<label key={`setting-lang-${l.code}`} className="settings-check">
												<input
													type="checkbox"
													checked={shown}
													disabled={locked}
													onChange={() => toggleLanguage(l.code)}
												/>
												{l.display}
											</label>
										)
									})}
								</div>
							</div>

							<div className="settings-cache-row">
								<button
									type="button"
									className={
										'settings-flight-mode'
									+ (settings.flightMode ? ' on' : '')
									+ (caching ? ' busy' : '')
									}
									aria-label={t('flight.label')}
									aria-pressed={settings.flightMode}
									title={t('flight.title')}
									onClick={() => onChange({ ...settings, flightMode: !settings.flightMode })}
								>
								✈️
								</button>
								<span className="settings-cache-count" title={t('cache.count')}>
								🔊 {cachedCount}
								</span>
								<button
									type="button"
									className="settings-cache-clear"
									aria-label={t('cache.clear')}
									title={settings.flightMode
										? t('cache.clearTitleDisabled')
										: t('cache.clearTitle')}
									disabled={settings.flightMode || caching}
									onClick={onClearCache}
								>
								🗑️
								</button>
							</div>
						</div>
					)}

					{tab === 'play' && (
						<div className="settings-tabpanel" role="tabpanel" id="settings-panel-play" aria-labelledby="settings-tab-play">
							{/* all twelve at once — the tab has the room for them */}
							<AvatarSetting t={t} grid/>
						</div>
					)}

					<div className="settings-about">
						<span className="settings-about-left">
							{/* the share link is a footnote, not a feature: small, beside the version */}
							<button
								type="button"
								className="settings-copy-link"
								aria-label={t('share.copy')}
								title={t(COPY_TITLE[copyStatus])}
								onClick={() => copy(shareUrl())}
							>
								{COPY_ICON[copyStatus]}
							</button>
							<span>v{__APP_VERSION__}</span>
						</span>
						<a
							href="https://github.com/amerharb/sawt"
							target="_blank"
							rel="noopener noreferrer"
						>
							Amer Harb · GitHub
						</a>
					</div>
				</div>
			)}
		</div>
	)
}
