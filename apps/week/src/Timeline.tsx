/*
 * The year as one line: the seasons along the base, the months on them, the
 * weeks above the months, and one week drawn out of its place through a
 * funnel into its seven days — so a child can see a week is about a quarter of
 * a month, and a month a third of a season.
 *
 * Laid out in real pixels from the width it is given rather than scaled from
 * a fixed drawing, so its writing stays one size on a phone and on a laptop
 * and only *what* is written thins out as it narrows: the months keep their
 * numbers and lose their names, the week numbers keep every fifth.
 *
 * Right to left, for an Arabic or Hebrew interface, everything is mirrored:
 * January on the right, the week's days running leftwards, the globe on the
 * right.
 */
import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'

import type { Translate, UiLanguage } from './i18n'
import type { Day } from './days/Day'
import type { Month } from './months/Month'
import type { Season } from './seasons/Season'
import { dateAt, dayOfYear, daysIn, monthSpans, seasonRuns, sunTurns, weekBlocks, type Hemisphere } from './calendar'

/*
 * What the game says about an item, for its segment to show. A settled item
 * wears 👍 at its end and, in a courtyard, the animal of whoever got there
 * first at its start. A courtyard's item can also settle with nobody winning
 * it — the room voted it away, or it timed out — and that one gets 🤷‍♂️ and
 * no animal, the same as giving up alone.
 */
export type Mark = {
	playing?: boolean,
	solved?: boolean,
	wrong?: boolean,
	givenUp?: boolean,
	// a courtyard's winner, as their animal; null when nobody won it
	winner?: string | null,
	// in a round but not asked about: what a room did not deal
	out?: boolean,
}

type Props = {
	today: Date,
	// 0 = Sunday … 6 = Saturday, as Date counts them
	firstDay: number,
	hemisphere: Hemisphere,
	dir: 'ltr' | 'rtl',
	// the interface language, which writes every label
	ui: UiLanguage,
	t: Translate,
	// Sunday first, as Date counts them
	days: Day[],
	months: Month[],
	seasons: Season[],
	mark: (code: string) => Mark,
	onTap: (code: string) => void,
	onHemisphere: (hemisphere: Hemisphere) => void,
}

// the rows, top to bottom
const ZOOM = { top: 4, height: 56 }
const WEEKS = { top: 124, height: 22 }
const WEEK_NUMBERS = 158
const MONTHS = { top: 170, height: 46 }
const SEASONS = { top: 222, height: 30 }
const SUN = { label: 268, date: 281 }
const ARROW = 296
const HEIGHT = 306
// the globe's column, beside the months and seasons
const GLOBE = { column: 68, r: 26 }
// the space either side of the zoomed week, for ‹ and ›
const STEP = 36

let measurer: CanvasRenderingContext2D | null = null
let family = ''

// how wide a label will be, so a row can drop what does not fit
function textWidth(text: string, size: number, weight = 400): number {
	if (!measurer) {
		measurer = document.createElement('canvas').getContext('2d')
		family = getComputedStyle(document.body).fontFamily
	}
	if (!measurer) return text.length * size * 0.6
	measurer.font = `${weight} ${size}px ${family}`
	return measurer.measureText(text).width
}

// Intl's locale for an interface language: day before month in English too
const LOCALE: Record<UiLanguage, string> = {
	en: 'en-GB', ar: 'ar', de: 'de', el: 'el', sv: 'sv', th: 'th', tr: 'tr', zh: 'zh-CN', he: 'he',
}

/*
 * A day and its month, short, in the interface language, with the same month
 * names the line shows — so Arabic has the Levant's and Western digits, where
 * Intl would give Egypt's names and Arabic-Indic ones.
 */
function shortDate(date: Date, ui: UiLanguage, months: Month[]): string {
	const day = date.getDate()
	const month = months[date.getMonth()].short[ui]
	if (ui === 'zh') return `${month}${day}日`
	if (ui === 'de') return `${day}. ${month}`
	return `${day} ${month}`
}

// a weekday's name, as long as fits: the full one, then Intl's short and narrow
function dayName(day: Day, date: Date, ui: UiLanguage, room: number): string {
	const fits = (s: string) => textWidth(s, 13, 600) <= room
	if (fits(day.name[ui])) return day.name[ui]
	const short = new Intl.DateTimeFormat(LOCALE[ui], { weekday: 'short' }).format(date)
	if (fits(short)) return short
	return new Intl.DateTimeFormat(LOCALE[ui], { weekday: 'narrow' }).format(date)
}

// keep the labels that fit, in order of priority, never two overlapping
function spaced<T extends { x: number, width: number }>(labels: T[], gap = 6): T[] {
	const kept: T[] = []
	for (const label of labels) {
		const clear = kept.every(k => Math.abs(k.x - label.x) >= (k.width + label.width) / 2 + gap)
		if (clear) kept.push(label)
	}
	return kept
}

const onKeys = (act: () => void) => (e: KeyboardEvent) => {
	if (e.key === 'Enter' || e.key === ' ') {
		e.preventDefault()
		act()
	}
}

export default function Timeline({ today, firstDay, hemisphere, dir, ui, t, days, months, seasons, mark, onTap, onHemisphere }: Readonly<Props>) {
	const box = useRef<HTMLDivElement>(null)
	const [width, setWidth] = useState(0)
	useLayoutEffect(() => {
		const el = box.current
		if (!el) return
		// measured once now, so the first paint already has the line, then on every resize
		const style = getComputedStyle(el)
		setWidth(Math.round(el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)))
		const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	const year = today.getFullYear()
	const todayDay = dayOfYear(today)
	/*
	 * The zoomed week is held as a day of the year inside it rather than as a
	 * week's index, so a change of first day keeps it on the same days, now
	 * cut into a different week.
	 */
	const [anchor, setAnchor] = useState(todayDay)

	const W = Math.max(width, 300)
	const rtl = dir === 'rtl'
	// a left-to-right x, mirrored for right to left
	const X = (x: number) => (rtl ? W - x : x)
	const X0 = GLOBE.column + 14
	const X1 = W - 16
	const N = daysIn(year)
	const at = (day: number) => X0 + (day * (X1 - X0)) / N
	// a span of days as a rectangle's x and width, either way round
	const span = (from: number, to: number, inset = 0) => {
		const a = X(at(from)), b = X(at(to))
		return { x: Math.min(a, b) + inset, w: Math.abs(b - a) - 2 * inset }
	}

	const blocks = weekBlocks(year, firstDay)
	const zoomIndex = Math.max(0, blocks.findIndex(b => anchor >= b.from && anchor < b.to))
	const zoom = blocks[zoomIndex]
	const step = (by: number) => {
		const next = blocks[(zoomIndex + by + blocks.length) % blocks.length]
		setAnchor(next.from)
	}

	const monthOf = months.slice().sort((a, b) => a.index - b.index)
	const spans = monthSpans(year)
	const runs = seasonRuns(year, hemisphere)
	const turns = sunTurns(year).map(instant => dayOfYear(instant))
	const seasonBy = Object.fromEntries(seasons.map(s => [s.code, s]))

	// the marks a segment wears: 👍 / 👎 / 🤷‍♂️ at its end, the winner at its start
	const marks = (code: string, x: number, w: number, top: number) => {
		const m = mark(code)
		const sign = m.wrong ? '👎' : m.givenUp ? '🤷‍♂️' : m.solved ? (m.winner === null ? '🤷‍♂️' : '👍') : null
		if (!sign) return null
		const end = rtl ? x + 8 : x + w - 8
		const start = rtl ? x + w - 9 : x + 9
		return (
			<g className="tl-mark" aria-hidden="true">
				<text x={end} y={top + 11} textAnchor="middle" fontSize={12}>{sign}</text>
				{m.winner && w >= 40 && <text x={start} y={top + 12} textAnchor="middle" fontSize={13}>{m.winner}</text>}
			</g>
		)
	}
	const segClass = (code: string, base: string) => {
		const m = mark(code)
		return [base, m.playing && 'playing', (m.solved || m.givenUp) && 'done', m.wrong && 'wrong', m.out && 'out']
			.filter(Boolean).join(' ')
	}
	const blocked = (code: string) => {
		const m = mark(code)
		return Boolean(m.solved || m.givenUp || m.wrong || m.out)
	}
	const tap = (code: string) => () => {
		if (!blocked(code)) onTap(code)
	}
	const outline = (x: number, y: number, w: number, h: number, r = 4) =>
		<rect className="tl-today" x={x} y={y} width={w} height={h} rx={r} pointerEvents="none"/>

	// ---- the zoomed week: seven days through a funnel
	const ZX0 = STEP, ZX1 = W - STEP
	const cell = (ZX1 - ZX0) / 7
	const zoomSpan = span(zoom.from, zoom.to)
	const zoomDays = Array.from({ length: 7 }, (_, k) => {
		const day = zoom.start + k
		const date = dateAt(year, day)
		const left = rtl ? ZX1 - (k + 1) * cell : ZX0 + k * cell
		return { day, date, left, inYear: day >= 0 && day < N, item: days[date.getDay()] }
	})

	// ---- week numbers, the zoomed one first, then every fifth and the ends
	const weekLabels = spaced([
		{ i: zoomIndex },
		...blocks.map((b, i) => ({ i, b })).filter(({ i, b }) => i !== zoomIndex
			&& (b.number % 5 === 0 || b.number === 1 || i === 0 || i === blocks.length - 1)),
	].map(({ i }) => {
		const b = blocks[i]
		const s = span(b.from, b.to)
		return { i, text: String(b.number), x: s.x + s.w / 2, width: textWidth(String(b.number), 11, i === zoomIndex ? 700 : 400) }
	}))

	// ---- the sun's four days, the labels where they fit
	const sunLabel = (i: number) => {
		if (i === 0 || i === 2) return { sign: '🌗', text: t('sun.equal') }
		const longest = (i === 1) === (hemisphere === 'north')
		return longest ? { sign: '☀️', text: t('sun.longest') } : { sign: '🌙', text: t('sun.shortest') }
	}
	/*
	 * Each one says what it is and when, on two lines: "☀️ Longest day" over
	 * "21 Jun". Where the four do not all fit, the words go and the sign
	 * stays beside the date.
	 */
	const sunMarks = turns.map((day, i) => {
		const { sign, text } = sunLabel(i)
		const date = shortDate(dateAt(year, day), ui, monthOf)
		const x = X(at(day + 0.5))
		const width = Math.max(textWidth(`${sign} ${text}`, 11, 600), textWidth(date, 11))
		return { i, x, top: `${sign} ${text}`, bottom: date, width }
	})
	const sunLabels = spaced(sunMarks).length === 4
		? sunMarks
		: sunMarks.map(s => ({ ...s, top: `${sunLabel(s.i).sign} ${s.bottom}`, bottom: '', width: textWidth(`☀️ ${s.bottom}`, 11) }))
	// a label kept over the line, clear of the arrow at either end
	const clamp = (x: number, w: number) => {
		const lo = Math.min(X(X0), X(X1)), hi = Math.max(X(X0), X(X1))
		return Math.min(Math.max(x, lo + w / 2), hi - w / 2)
	}

	// the months' names, for all of them or none: February is the narrowest
	const narrowest = Math.min(...spans.map(m => span(m.start, m.start + m.days, 1).w))
	const monthNames = monthOf.every(m => textWidth(m.short[ui], 11) <= narrowest - 4)
	// a season's name at 13px, or 11px where that does not fit, or not at all
	const seasonSize = (name: string, room: number) =>
		[13, 11].find(size => textWidth(name, size, 600) <= room - 6)

	// ---- the globe, at the start of the line
	const GX = X(GLOBE.column / 2)
	const GY = (MONTHS.top + SEASONS.top + SEASONS.height) / 2
	const R = GLOBE.r
	const north = hemisphere === 'north'
	const tilt = 0.41 // the Earth's 23.4°, in radians
	const half = (top: boolean) => `M${GX - R} ${GY} A${R} ${R} 0 0 ${top ? 1 : 0} ${GX + R} ${GY} Z`

	// ---- ‹ and ›: earlier is on the left left to right, on the right right to left
	const stepButton = (side: 'left' | 'right') => {
		const later = (side === 'right') !== rtl
		const cx = side === 'left' ? STEP / 2 : W - STEP / 2
		const cy = ZOOM.top + ZOOM.height / 2
		return (
			<g
				className="tl-step"
				role="button"
				tabIndex={0}
				aria-label={later ? t('week.next') : t('week.previous')}
				onClick={() => step(later ? 1 : -1)}
				onKeyDown={onKeys(() => step(later ? 1 : -1))}
			>
				<circle cx={cx} cy={cy} r={14}/>
				{/* drawn, not written: ‹ and › are mirrored characters, which a
				    right-to-left page turns round to point inwards */}
				<path d={side === 'left'
					? `M${cx + 3} ${cy - 6} L${cx - 3} ${cy} L${cx + 3} ${cy + 6}`
					: `M${cx - 3} ${cy - 6} L${cx + 3} ${cy} L${cx - 3} ${cy + 6}`}
				/>
			</g>
		)
	}

	return (
		<div className="timeline" ref={box} dir={dir}>
			{width > 0 && (
				<svg className="tl" width={W} height={HEIGHT} viewBox={`0 0 ${W} ${HEIGHT}`} role="group" aria-label={String(year)}>
					<defs>
						<marker id="tl-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
							<path className="tl-arrowhead" d="M2 1L8 5L2 9"/>
						</marker>
						<clipPath id="tl-globe"><circle cx={GX} cy={GY} r={R}/></clipPath>
					</defs>

					<polygon
						className="tl-funnel"
						points={`${ZX0},${ZOOM.top + ZOOM.height} ${ZX1},${ZOOM.top + ZOOM.height} ${zoomSpan.x + zoomSpan.w},${WEEKS.top} ${zoomSpan.x},${WEEKS.top}`}
					/>

					{zoomDays.map(({ day, date, left, inYear, item }) => {
						const x = left + 2, w = cell - 4
						return (
							<g key={day}>
								<rect
									className={segClass(item.code, 'tl-seg tl-day') + (inYear ? '' : ' outside')}
									x={x} y={ZOOM.top} width={w} height={ZOOM.height} rx={6}
									role="button" tabIndex={0}
									aria-label={`${item.name[ui]}, ${shortDate(date, ui, monthOf)}`}
									onClick={tap(item.code)}
									onKeyDown={onKeys(tap(item.code))}
								/>
								<text className="tl-label strong" x={x + w / 2} y={ZOOM.top + 23} textAnchor="middle">
									{dayName(item, date, ui, w - 6)}
								</text>
								<text className="tl-label small muted" x={x + w / 2} y={ZOOM.top + 43} textAnchor="middle">
									{textWidth(shortDate(date, ui, monthOf), 11) <= w - 6 ? shortDate(date, ui, monthOf) : date.getDate()}
								</text>
								{day === todayDay && outline(x, ZOOM.top, w, ZOOM.height, 6)}
								{marks(item.code, x, w, ZOOM.top)}
							</g>
						)
					})}
					{stepButton('left')}
					{stepButton('right')}

					<text className="tl-label year" x={GX} y={WEEKS.top + WEEKS.height / 2} textAnchor="middle" dominantBaseline="central">{year}</text>
					{blocks.map((b, i) => {
						const s = span(b.from, b.to, 0.4)
						const label = t('week.number').replace('{n}', String(b.number))
						return (
							<g key={b.start}>
								<rect
									className={'tl-seg tl-week' + (i === zoomIndex ? ' zoomed' : '') + (b.to - b.from < 7 ? ' partial' : '') + (i % 2 ? ' odd' : '')}
									x={s.x} y={WEEKS.top} width={Math.max(s.w, 1)} height={WEEKS.height} rx={1.5}
									role="button" tabIndex={0} aria-label={label} aria-pressed={i === zoomIndex}
									onClick={() => setAnchor(b.from)}
									onKeyDown={onKeys(() => setAnchor(b.from))}
								/>
								{todayDay >= b.from && todayDay < b.to && outline(s.x, WEEKS.top, s.w, WEEKS.height, 1.5)}
							</g>
						)
					})}
					{weekLabels.map(l => (
						<text key={l.i} className={'tl-label small' + (l.i === zoomIndex ? ' strong' : ' muted')} x={l.x} y={WEEK_NUMBERS} textAnchor="middle">{l.text}</text>
					))}

					{spans.map(m => {
						const month = monthOf[m.index]
						const s = span(m.start, m.start + m.days, 1)
						const season = runs.find(r => m.start >= r.from && m.start < r.to)!.season
						return (
							<g key={month.code}>
								<rect
									className={segClass(month.code, 'tl-seg tl-month')}
									style={{ fill: `var(--season-${season})` }}
									x={s.x} y={MONTHS.top} width={s.w} height={MONTHS.height} rx={3}
									role="button" tabIndex={0} aria-label={month.name[ui]}
									onClick={tap(month.code)}
									onKeyDown={onKeys(tap(month.code))}
								/>
								<text className="tl-label strong" x={s.x + s.w / 2} y={MONTHS.top + (monthNames ? 18 : 27)} textAnchor="middle">{m.index + 1}</text>
								{monthNames && <text className="tl-label small" x={s.x + s.w / 2} y={MONTHS.top + 36} textAnchor="middle">{month.short[ui]}</text>}
								{today.getMonth() === m.index && outline(s.x, MONTHS.top, s.w, MONTHS.height, 3)}
								{marks(month.code, s.x, s.w, MONTHS.top)}
							</g>
						)
					})}
					<rect className="tl-zoom-slice" x={zoomSpan.x} y={MONTHS.top} width={zoomSpan.w} height={MONTHS.height} pointerEvents="none"/>

					{runs.map(r => {
						const season = seasonBy[r.season]
						const s = span(r.from, r.to, 1)
						const name = season.name[ui]
						const size = seasonSize(name, s.w)
						return (
							<g key={r.from}>
								<rect
									className={segClass(season.code, 'tl-seg tl-season')}
									style={{ fill: `var(--season-${r.season})` }}
									x={s.x} y={SEASONS.top} width={s.w} height={SEASONS.height} rx={4}
									role="button" tabIndex={0} aria-label={name}
									onClick={tap(season.code)}
									onKeyDown={onKeys(tap(season.code))}
								/>
								{size && (
									<text className="tl-label strong" x={s.x + s.w / 2} y={SEASONS.top + 20} textAnchor="middle" style={{ fontSize: size }}>{name}</text>
								)}
								{todayDay >= r.from && todayDay < r.to && outline(s.x, SEASONS.top, s.w, SEASONS.height)}
								{marks(season.code, s.x, s.w, SEASONS.top)}
							</g>
						)
					})}

					{sunLabels.map(s => (
						<g key={s.i} className="tl-sun" aria-hidden="true">
							<line x1={s.x} y1={SEASONS.top + SEASONS.height} x2={s.x} y2={SUN.label - 11}/>
							<circle cx={s.x} cy={SEASONS.top + SEASONS.height} r={3}/>
							<text className="tl-label small strong" x={clamp(s.x, s.width)} y={SUN.label} textAnchor="middle">{s.top}</text>
							{s.bottom && <text className="tl-label small muted" x={clamp(s.x, s.width)} y={SUN.date} textAnchor="middle">{s.bottom}</text>}
						</g>
					))}

					<path
						className="tl-again"
						d={`M${X(X1 + 1)} ${SEASONS.top + SEASONS.height / 2} H${X(X1 + 8)} V${ARROW} H${X(X0 - 8)} V${SEASONS.top + SEASONS.height / 2 + 8} H${X(X0 - 3)}`}
						markerEnd="url(#tl-arrow)"
					/>

					<g clipPath="url(#tl-globe)">
						<path
							className={'tl-hemisphere' + (north ? ' chosen' : '')}
							d={half(true)}
							role="button" tabIndex={0} aria-label={t('hemisphere.northAria')} aria-pressed={north}
							onClick={() => onHemisphere('north')}
							onKeyDown={onKeys(() => onHemisphere('north'))}
						/>
						<path
							className={'tl-hemisphere' + (north ? '' : ' chosen')}
							d={half(false)}
							role="button" tabIndex={0} aria-label={t('hemisphere.southAria')} aria-pressed={!north}
							onClick={() => onHemisphere('south')}
							onKeyDown={onKeys(() => onHemisphere('south'))}
						/>
						<ellipse className="tl-meridian" cx={GX} cy={GY} rx={R * 0.4} ry={R}/>
						<line className="tl-meridian" x1={GX - R} y1={GY - R / 2} x2={GX + R} y2={GY - R / 2}/>
						<line className="tl-meridian" x1={GX - R} y1={GY + R / 2} x2={GX + R} y2={GY + R / 2}/>
					</g>
					<circle className="tl-globe" cx={GX} cy={GY} r={R}/>
					<line className="tl-globe" x1={GX - R} y1={GY} x2={GX + R} y2={GY}/>
					<line
						className="tl-axis"
						x1={GX - (R + 7) * Math.sin(tilt)} y1={GY - (R + 7) * Math.cos(tilt)}
						x2={GX + (R + 7) * Math.sin(tilt)} y2={GY + (R + 7) * Math.cos(tilt)}
					/>
					<text className={'tl-label small' + (north ? ' strong' : ' muted')} x={GX} y={GY - R - 10} textAnchor="middle">{t('hemisphere.north')}</text>
					<text className={'tl-label small' + (north ? ' muted' : ' strong')} x={GX} y={GY + R + 17} textAnchor="middle">{t('hemisphere.south')}</text>
				</svg>
			)}
		</div>
	)
}
