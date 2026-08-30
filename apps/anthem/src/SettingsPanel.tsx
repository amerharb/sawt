import { groupByContinent, regionGroups } from '@sawt/world'
import { useEffect, useRef, useState } from 'react'
import { useCopyLink, COPY_ICON, COPY_TITLE } from '@sawt/ui'
import { Theme, DisplayMode, SortMode, Settings } from './settingsStore'

// structural type so this stays app-agnostic (no import from i18n)
type Translate = (key: string) => string

const THEME_OPTIONS: { value: Theme, icon: string, key: string }[] = [
	{ value: 'system', icon: '🖥️', key: 'theme.system' },
	{ value: 'light', icon: '☀️', key: 'theme.light' },
	{ value: 'dark', icon: '🌙', key: 'theme.dark' },
]

const DISPLAY_OPTIONS: { value: DisplayMode, icon: string, key: string }[] = [
	{ value: 'flag', icon: '🏳️', key: 'display.flag' },
	{ value: 'name', icon: '🔤', key: 'display.name' },
]

// how many targets one game round asks: a short game, a longer one, or 0 —
// the whole board (∞)
const ROUND_OPTIONS: { value: number }[] = [
	{ value: 10 }, { value: 20 }, { value: 50 }, { value: 0 },
]

const SORT_OPTIONS: { value: SortMode, icon: string, key: string }[] = [
	{ value: 'code', icon: '🌐', key: 'sort.code' },
	{ value: 'name', icon: '🔤', key: 'sort.name' },
	{ value: 'random', icon: '🎲', key: 'sort.random' },
]

type Props = {
	settings: Settings,
	// full (beta-filtered) country list, so the checklist always shows everything supported
	countries: { code: string, flag: string }[],
	// true while flight-mode downloads are running
	caching: boolean,
	// number of sound files currently in the cache
	cachedCount: number,
	// when true (game in progress), the panel can't be opened
	locked: boolean,
	// a round is being played right now — the round length alone locks on this
	// (the rest of the panel locks for all of game mode), so the next round's
	// size can change between rounds without leaving the game
	roundRunning: boolean,
	// UI-string translator (falls back to English)
	t: Translate,
	// the current interface language and the options for its dropdown
	uiLanguage: string,
	uiLanguages: { code: string, display: string }[],
	onSetUiLanguage: (code: string) => void,
	onSetDisplayMode: (mode: DisplayMode) => void,
	onSetSort: (mode: SortMode) => void,
	onChange: (settings: Settings) => void,
	onClearCache: () => void,
	// the share link for the current settings, built when the button is pressed so
	// it always reflects what is on screen now
	shareUrl: () => string,
}

export default function SettingsPanel({ settings, countries, caching, cachedCount, locked, roundRunning, t, uiLanguage, uiLanguages, onSetUiLanguage, onSetDisplayMode, onSetSort, onChange, onClearCache, shareUrl }: Readonly<Props>) {
	const [open, setOpen] = useState(false)
	// which group menu is open above the country list: ➕ adds, ➖ removes
	const [groupMenu, setGroupMenu] = useState<'add' | 'remove' | null>(null)
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

	const toggleCountry = (code: string) => {
		const hiddenCountries = settings.hiddenCountries.includes(code)
			? settings.hiddenCountries.filter(c => c !== code)
			: [...settings.hiddenCountries, code]
		onChange({ ...settings, hiddenCountries })
	}


	// one tap on a group — a continent or a region — through the same
	// hiddenCountries mechanism the global buttons use
	const showGroup = (items: readonly { code: string }[]) => {
		const codes = new Set(items.map(i => i.code))
		onChange({ ...settings, hiddenCountries: settings.hiddenCountries.filter(c => !codes.has(c)) })
	}
	const hideGroup = (items: readonly { code: string }[]) => {
		onChange({ ...settings, hiddenCountries: [...new Set([...settings.hiddenCountries, ...items.map(i => i.code)])] })
	}
	const showAllCountries = () => onChange({ ...settings, hiddenCountries: [] })
	const hideAllCountries = () => onChange({ ...settings, hiddenCountries: countries.map(c => c.code) })

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
						<div className="settings-segmented" role="group" aria-label={t('group.roundLength')}>
							<span className="settings-segmented-icon" aria-hidden="true">🏁</span>
							{ROUND_OPTIONS.map(opt => {
								// "Play only 10" / "Whole board" — spelled out, since a bare
								// number on a button explains nothing
								const label = opt.value === 0
									? t('roundLength.all')
									: t('roundLength.only').replace('{n}', String(opt.value))
								return (
									<button
										key={`round-${opt.value}`}
										type="button"
										className={settings.roundLength === opt.value ? 'segment selected' : 'segment'}
										aria-pressed={settings.roundLength === opt.value}
										aria-label={label}
										title={label}
										disabled={roundRunning}
										onClick={() => onChange({ ...settings, roundLength: opt.value })}
									>
										{opt.value === 0 ? '∞' : opt.value}
									</button>
								)
							})}
						</div>
					</div>

					<div className="settings-row">
						<label className="settings-uilang">
							<span className="settings-uilang-icon" aria-hidden="true">👁️</span>
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
						<div className="settings-segmented" role="group" aria-label={t('display.group')}>
							{DISPLAY_OPTIONS.map(opt => (
								<button
									key={opt.value}
									type="button"
									className={settings.displayMode === opt.value ? 'segment selected' : 'segment'}
									aria-pressed={settings.displayMode === opt.value}
									aria-label={t(opt.key)}
									title={t(opt.key)}
									onClick={() => onSetDisplayMode(opt.value)}
								>
									{opt.icon}
								</button>
							))}
						</div>
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

					<div className="settings-row">
						<div className="settings-select-all">
							<button
								type="button"
								aria-label={t('selectAllCountries')}
								title={t('selectAll')}
								disabled={locked}
								onClick={showAllCountries}
							>
								✅
							</button>
							<button
								type="button"
								aria-label={t('deselectAllCountries')}
								title={t('deselectAll')}
								disabled={locked}
								onClick={hideAllCountries}
							>
								⬜
							</button>
							{/* one-tap groups. Continents today; the regions to come (EU,
							    the Middle East, South Asia, Eurovision…) join the same
							    menu as further sections. */}
							<span className="settings-groups">
								<button
									type="button"
									aria-label={t('groups.add')}
									title={t('groups.add')}
									aria-expanded={groupMenu === 'add'}
									disabled={locked}
									onClick={() => setGroupMenu(m => (m === 'add' ? null : 'add'))}
								>
									➕
								</button>
								<button
									type="button"
									aria-label={t('groups.remove')}
									title={t('groups.remove')}
									aria-expanded={groupMenu === 'remove'}
									disabled={locked}
									onClick={() => setGroupMenu(m => (m === 'remove' ? null : 'remove'))}
								>
									➖
								</button>
								{groupMenu && (
									<span className="settings-group-menu" role="menu">
										<span className="settings-group-menu-title">{t('groups.continents')}</span>
										{groupByContinent(countries).map(group => (
											<button
												key={group.continent}
												type="button"
												role="menuitem"
												onClick={() => {
													if (groupMenu === 'add') showGroup(group.items)
													else hideGroup(group.items)
													setGroupMenu(null)
												}}
											>
												{group.continent === 'unclassified' ? '…' : t(`continent.${group.continent}`)}
											</button>
										))}
										<span className="settings-group-menu-title">{t('groups.regions')}</span>
										{regionGroups(countries).map(group => (
											<button
												key={group.region}
												type="button"
												role="menuitem"
												onClick={() => {
													if (groupMenu === 'add') showGroup(group.items)
													else hideGroup(group.items)
													setGroupMenu(null)
												}}
											>
												{t(`region.${group.region}`)}
											</button>
										))}
									</span>
								)}
							</span>
						</div>
						<div className="settings-flag-grid" role="group" aria-label={t('group.countries')}>
							{countries.map(c => {
								const shown = !settings.hiddenCountries.includes(c.code)
								return (
									<button
										key={`setting-country-${c.code}`}
										type="button"
										className={shown ? 'flag-toggle' : 'flag-toggle hidden'}
										aria-pressed={shown}
										disabled={locked}
										onClick={() => toggleCountry(c.code)}
									>
										{c.flag}
									</button>
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

					<div className="settings-share-row">
						<button
							type="button"
							className="settings-copy-link"
							aria-label={t('share.copy')}
							title={t(COPY_TITLE[copyStatus])}
							onClick={() => copy(shareUrl())}
						>
							{COPY_ICON[copyStatus]}
						</button>
					</div>

					<div className="settings-about">
						<span>v{__APP_VERSION__}</span>
						<a
							href="https://github.com/amerharb/anthem"
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
