import { useEffect, useRef, useState } from 'react'
import { useCopyLink, COPY_ICON, COPY_TITLE } from '@sawt/ui'
import { Language } from './days/Day'
import { Theme, Settings } from './settingsStore'
import { AvatarSetting } from '@sawt/game'

// structural type so this stays app-agnostic (no import from i18n)
type Translate = (key: string) => string

const THEME_OPTIONS: { value: Theme, icon: string, key: string }[] = [
	{ value: 'system', icon: '🖥️', key: 'theme.system' },
	{ value: 'light', icon: '☀️', key: 'theme.light' },
	{ value: 'dark', icon: '🌙', key: 'theme.dark' },
]

/*
 * Three tabs, as Colour's panel has: 👁️ what you see, 👂 what you hear, 🕹️ the
 * game. Which day the week starts on is a question about what you see, so it
 * sits under 👁️ with the theme and the interface language.
 */
const TABS = [
	{ id: 'see', icon: '👁️', key: 'tab.see' },
	{ id: 'hear', icon: '👂', key: 'tab.hear' },
	{ id: 'play', icon: '🕹️', key: 'tab.play' },
] as const

type TabId = typeof TABS[number]['id']

type Props = {
	settings: Settings,
	// full (beta-filtered) language list, so the checklist always shows everything supported
	languages: { code: Language, display: string }[],
	// the seven days in week order, labelled for the "first day" dropdown
	dayOptions: { code: string, label: string }[],
	// true while flight-mode downloads are running
	caching: boolean,
	// number of sound files currently in the cache
	cachedCount: number,
	// while a round is on (or a room is open), the language list can't be changed; between rounds they can
	locked: boolean,
	// UI-string translator (falls back to English)
	t: Translate,
	// the current interface language and the options for its dropdown
	uiLanguage: string,
	uiLanguages: { code: string, display: string }[],
	onSetUiLanguage: (code: string) => void,
	onChange: (settings: Settings) => void,
	onSetFirstDay: (code: string) => void,
	onClearCache: () => void,
	// the share link for the current settings, built when the button is pressed so
	// it always reflects what is on screen now
	shareUrl: () => string,
}

export default function SettingsPanel({ settings, languages, dayOptions, caching, cachedCount, locked, t, uiLanguage, uiLanguages, onSetUiLanguage, onChange, onSetFirstDay, onClearCache, shareUrl }: Readonly<Props>) {
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

	const toggleLanguage = (code: Language) => {
		const hiddenLanguages = settings.hiddenLanguages.includes(code)
			? settings.hiddenLanguages.filter(c => c !== code)
			: [...settings.hiddenLanguages, code]
		onChange({ ...settings, hiddenLanguages })
	}

	const showAllLanguages = () => onChange({ ...settings, hiddenLanguages: [] })
	const hideAllLanguages = () => onChange({ ...settings, hiddenLanguages: languages.map(l => l.code) })

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
								<label className="settings-firstday">
									<span className="settings-firstday-label" title={t('firstDay.title')}>
									📅 1:
									</span>
									<select
										className="language-select"
										aria-label={t('firstDay.aria')}
										value={settings.firstDay}
										disabled={locked}
										onChange={(e) => onSetFirstDay(e.target.value)}
									>
										{dayOptions.map(o => (
											<option key={`firstday-${o.code}`} value={o.code}>{o.label}</option>
										))}
									</select>
								</label>
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
							href="https://github.com/amerharb/week"
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
