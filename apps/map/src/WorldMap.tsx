import { memo, useEffect, useMemo, useRef, useState } from 'react'

/*
 * The interactive world map: every country the app teaches is clickable and
 * colored by its state; the rest of the world is drawn but inert.
 *
 * The geometry lives in public/world.json rather than in the bundle — ~260 kB
 * of path data (~91 kB gzipped) that would double the JS payload if inlined.
 * It was generated from the Natural Earth 50m world atlas (public domain, via
 * the world-atlas package), projected with d3-geo's Natural Earth projection,
 * simplified, Antarctica omitted. Regenerating it is a build-time job, so d3
 * and topojson are not dependencies. App.tsx owns fetching it (through the
 * sound cache, so ✈️ makes the map itself available offline).
 *
 * Interaction is delegated to the <svg>: the teachable shapes carry a
 * `data-code` attribute and the handlers resolve clicks and hovers through
 * `closest('[data-code]')`. Untaught land carries no attribute, so it can
 * never reach the click handler — inert by construction, not by check.
 *
 * The hover tooltip is an imperative island. React renders the div once,
 * empty, and pointer events write into it directly (textContent + transform)
 * — hovering never re-renders the component, which matters with 237 paths.
 * Its two data-* attributes use `|| undefined` rather than `??`, so an empty
 * string drops the attribute instead of writing data-flag="": land the app
 * does not teach has no flag, and `[data-tip]` doubles as the hover-target
 * selector, so a nameless shape should not match it either.
 * Touch gets no tooltip: on a tap the click plays the name and the display
 * segment shows it, which is the family behaviour everywhere else.
 */

export type Shape = {
	/* ISO 3166-1 alpha-2, lowercase — or a project-assigned code where none
	   exists (xk Kosovo, xc Northern Cyprus). Absent for the leftover
	   territories (Indian Ocean Ter., Siachen Glacier), drawn but never
	   interactive. */
	c?: string,
	/* name from the atlas, shown in the tooltip for countries we don't teach */
	n: string,
	d: string,
	/* optional hand-authored clickable shape (see world.json's note): when
	   present, events come from this geometry and the land is visuals only */
	h?: string,
}

// x0 lets the frame start west of 0 so the full projected world fits
export type World = { x0?: number, width: number, height: number, shapes: Shape[] }

// how a country is drawn; every value is a CSS class on its shape
export type CountryState = 'unsupported' | 'idle' | 'clicked' | 'correct' | 'givenUp' | 'wrong'

/*
 * Markers, decided live. A country is drawn as a dot instead of its own
 * geometry when that geometry cannot be seen or hit *as rendered right now* —
 * which depends on the screen the map is on and on the current zoom, not on
 * atlas area alone. Hong Kong's polygon is a real 1.1x1.0 units: ~1.5px on a
 * desktop, invisible on a phone, but a perfectly good click target once the
 * near-miss zoom is in. So the threshold is rendered pixels:
 *
 *   dot when  (largest single part's √(w·h)) × (CSS px per map unit) < MARKER_PX
 *
 * The largest *part* decides, not the country's bounding box — an
 * archipelago's box spans ocean its land never fills, which is exactly the
 * mistake that once made eight island nations "big". Shrink the window or
 * zoom out and more countries become dots; grow it or zoom in and they
 * dissolve back into their real shapes.
 *
 * A dot is drawn ON TOP of its country's land, never instead of it. The land
 * used to be skipped — it is sub-pixel at the default threshold, so nothing
 * was lost — but a country carved out of a neighbour is a hole in that
 * neighbour's own path: skipping Lesotho's land let the sea show through
 * South Africa, a 6.6-unit gap around a 1.9-unit dot. Enclaves (Lesotho, San
 * Marino, the Vatican) make the land the only thing that can fill the hole,
 * and drawing it costs nothing when it is invisible anyway.
 *
 * A dot sits at its country's largest part's centre — every country, with no
 * exceptions and no table: the geometry alone decides where its marker goes.
 *
 * Radii are derived, not tuned. The two hazards the old hand-kept table
 * guarded against are now rules:
 *   · a dot next to another dot (the Lesser Antilles chain) keeps its hit
 *     circle inside half the distance to its nearest fellow dot;
 *   · a dot next to a small *country* (Bahrain once ate all of Qatar,
 *     Liechtenstein all of Switzerland) keeps its hit circle off the
 *     neighbour's boundary — dots paint on top of the map, so trespassing
 *     steals the neighbour's clicks.
 */
// a country becomes a dot when its rendered footprint drops below this
const MARKER_PX = 12
// visible dot and hit circle, in map units — the open-water maximums
const DOT_R_MAX = 2.5
const HIT_R_MAX = 8

type Metrics = {
	size: number, x: number, y: number,
	// the box of that same largest part, for framing (see fitViewOf)
	x0: number, y0: number, x1: number, y1: number,
}
const metricsCache = new Map<string, Metrics>()
// √(w·h) of the country's largest single part, and that part's centre
export function metricsOf(world: World, code: string): Metrics {
	let m = metricsCache.get(code)
	if (m) return m
	const d = world.shapes.find(s => s.c === code)?.d ?? ''
	let best: Metrics = { size: 0, x: 0, y: 0, x0: NaN, y0: NaN, x1: NaN, y1: NaN }
	for (const part of d.split(/(?=M)/)) {
		let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
		for (const v of part.matchAll(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g)) {
			const x = Number(v[1]), y = Number(v[2])
			if (x < minX) minX = x
			if (x > maxX) maxX = x
			if (y < minY) minY = y
			if (y > maxY) maxY = y
		}
		if (minX === Infinity) continue
		const size = Math.sqrt((maxX - minX) * (maxY - minY))
		// >= not >: a geometry simplified down to a single point has size 0,
		// and its position must still win over the {0,0} starting value
		if (size >= best.size) {
			best = {
				size,
				x: (minX + maxX) / 2, y: (minY + maxY) / 2,
				x0: minX, y0: minY, x1: maxX, y1: maxY,
			}
		}
	}
	m = best
	metricsCache.set(code, m)
	return m
}

// every part of a country as its own box, cached like the metrics above
const partsCache = new Map<string, { x0: number, y0: number, x1: number, y1: number }[]>()
function partsOf(world: World, code: string): { x0: number, y0: number, x1: number, y1: number }[] {
	let boxes = partsCache.get(code)
	if (boxes) return boxes
	boxes = []
	const d = world.shapes.find(s => s.c === code)?.d ?? ''
	for (const part of d.split(/(?=M)/)) {
		let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
		for (const v of part.matchAll(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g)) {
			const x = Number(v[1]), y = Number(v[2])
			if (x < minX) minX = x
			if (x > maxX) maxX = x
			if (y < minY) minY = y
			if (y > maxY) maxY = y
		}
		if (minX !== Infinity) boxes.push({ x0: minX, y0: minY, x1: maxX, y1: maxY })
	}
	partsCache.set(code, boxes)
	return boxes
}

/*
 * Zoom to fit: the smallest view that frames the given countries, with a
 * margin. It starts from each country's main mass and then absorbs any
 * outlying part that lies within FIT_GAP of the frame, over and over until
 * nothing new is close enough. That is what tells a territory from an
 * outlier without a list of special cases: Alaska and Hawaii join a frame
 * around the United States, Svalbard and the Canaries join one around
 * Europe, while French Guiana, Réunion and the Dutch Caribbean stay out of
 * it — they are an ocean away, and pulling them in would shrink Europe to a
 * corner of its own map. Antimeridian fragments (the Aleutians at the far
 * east of the projection, Fiji, Chukotka) are simply the farthest outliers
 * of all, so the same rule drops them.
 *
 * Returns null when framing buys nothing: no countries, or a frame as big as
 * the world.
 */
const FIT_MARGIN = 0.08   // of the framed extent
const FIT_MIN = 60        // map units: a single micro-state still keeps context
const FIT_GAP = 60        // how near an outlying part must be to be pulled in
export function fitViewOf(world: World, codes: readonly string[]): MapView | null {
	let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
	const outlying: { x0: number, y0: number, x1: number, y1: number }[] = []
	for (const code of codes) {
		const m = metricsOf(world, code)
		if (!Number.isFinite(m.x0)) continue
		// the main mass seeds the frame; every other part waits its turn
		if (m.x0 < x0) x0 = m.x0
		if (m.y0 < y0) y0 = m.y0
		if (m.x1 > x1) x1 = m.x1
		if (m.y1 > y1) y1 = m.y1
		for (const b of partsOf(world, code)) {
			if (b.x0 < m.x0 || b.x1 > m.x1 || b.y0 < m.y0 || b.y1 > m.y1) outlying.push(b)
		}
	}
	if (!Number.isFinite(x0)) return null

	// absorb what is near, then look again: a part pulled in can bring the
	// frame close enough to reach the next one (Alaska, then Hawaii)
	const taken = new Array(outlying.length).fill(false)
	for (let grew = true; grew;) {
		grew = false
		for (let i = 0; i < outlying.length; i++) {
			if (taken[i]) continue
			const b = outlying[i]
			const dx = Math.max(0, x0 - b.x1, b.x0 - x1)
			const dy = Math.max(0, y0 - b.y1, b.y0 - y1)
			if (dx > FIT_GAP || dy > FIT_GAP) continue
			taken[i] = true
			grew = true
			if (b.x0 < x0) x0 = b.x0
			if (b.y0 < y0) y0 = b.y0
			if (b.x1 > x1) x1 = b.x1
			if (b.y1 > y1) y1 = b.y1
		}
	}

	const pad = Math.max((x1 - x0), (y1 - y0)) * FIT_MARGIN
	let w = Math.max(x1 - x0 + pad * 2, FIT_MIN)
	let h = Math.max(y1 - y0 + pad * 2, FIT_MIN * (world.height / world.width))
	const worldX0 = world.x0 ?? 0
	if (w >= world.width && h >= world.height) return null
	w = Math.min(w, world.width)
	h = Math.min(h, world.height)
	// centred on the framed countries, then slid back inside the map
	const cx = (x0 + x1) / 2
	const cy = (y0 + y1) / 2
	return {
		x: Math.min(Math.max(cx - w / 2, worldX0), worldX0 + world.width - w),
		y: Math.min(Math.max(cy - h / 2, 0), world.height - h),
		w,
		h,
	}
}

// what a hover shows: the country's flag (empty for land the app does not
// teach) and its name in the interface language
export type Tip = { flag: string, name: string }

// a zoomed-in window on the map, in map units; null shows the whole world
export type MapView = { x: number, y: number, w: number, h: number }

// how long a view change glides (near-miss zoom in, end-of-prompt zoom out)
const ZOOM_MS = 400

/* distance in map units from a point to a country — to its dot for the
 * marker countries, to the nearest path vertex for the rest (a boundary
 * approximation, plenty for judging a near-miss). Parsed vertices are cached:
 * the atlas is static for the session. */
const pointsCache = new Map<string, [number, number][]>()
export function distanceToCountry(world: World, code: string, x: number, y: number): number {
	let pts = pointsCache.get(code)
	if (!pts) {
		const d = world.shapes.find(s => s.c === code)?.d ?? ''
		pts = [...d.matchAll(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g)].map(m => [Number(m[1]), Number(m[2])])
		pointsCache.set(code, pts)
	}
	if (pts.length === 0) {
		// no geometry at all: its dot is the country
		const m = metricsOf(world, code)
		return Math.hypot(x - m.x, y - m.y)
	}
	let best = Infinity
	for (const [px, py] of pts) {
		const dist = Math.hypot(x - px, y - py)
		if (dist < best) best = dist
	}
	return best
}

type Props = {
	world: World,
	// how to draw a coded shape right now
	stateOf: (code: string) => CountryState,
	// tooltip content for a shape, or null for none (game mode returns null for
	// everything, so hovering cannot reveal the answer)
	tipOf: (shape: Shape) => Tip | null,
	// accessible name for a teachable country (always on, in game mode too — a
	// screen reader finding the target by name is access, not cheating)
	nameOf: (code: string) => string,
	/* every click on the map, teachable country or not: its code (null for
	   ocean and untaught land) and where it landed in map units (null when
	   there is no point, i.e. keyboard activation) */
	onMapClick: (code: string | null, point: { x: number, y: number } | null) => void,
	// the zoomed-in window (near-miss forgiveness in the game); null = whole world
	view: MapView | null,
	// every code the app teaches (visible or hidden alike) — only these are
	// ever drawn as dots; untaught land stays inert geometry
	taughtCodes: readonly string[],
}

const codeOf = (t: EventTarget | null) =>
	(t as Element | null)?.closest?.('[data-code]')?.getAttribute('data-code')

// mouse and pen hover; touch is handled by click + the display segment
const hovers = (e: React.PointerEvent) => e.pointerType === 'mouse' || e.pointerType === 'pen'

export const WorldMap = memo(function WorldMap({ world, stateOf, tipOf, nameOf, onMapClick, view, taughtCodes }: Props) {
	const tipRef = useRef<HTMLDivElement>(null)
	// the tooltip's rendered width, measured once when its text changes — so
	// the per-move handler never forces a layout read
	const tipWidth = useRef(0)
	const svgRef = useRef<SVGSVGElement>(null)
	// the map's rendered CSS width — with the view's width in map units this
	// gives px-per-unit, the number the marker threshold lives on
	const [pxWidth, setPxWidth] = useState(0)
	useEffect(() => {
		// observe the wrapping div, not the <svg>: ResizeObserver does not fire
		// for CSS-driven size changes of SVG elements. A window resize listener
		// backs it up — observer delivery rides rendering frames, which hidden
		// tabs starve, while resize events keep firing; both feed one measure.
		const area = svgRef.current?.parentElement
		if (!area) return
		const measure = () => setPxWidth(area.getBoundingClientRect().width)
		measure()
		const ro = new ResizeObserver(measure)
		ro.observe(area)
		window.addEventListener('resize', measure)
		return () => {
			ro.disconnect()
			window.removeEventListener('resize', measure)
		}
	}, [])

	/*
	 * Which countries are dots right now. Uses the *target* view rather than
	 * each animation frame, so the set changes once per zoom, not per frame.
	 */
	const viewW = view?.w ?? world.width
	// until the map has a measured width, assume a laptop rather than zero —
	// a zero would briefly turn the whole world into dots
	const ppu = (pxWidth || window.innerWidth || 1024) / viewW
	const markerCodes = useMemo(() => {
		const set = new Set<string>()
		for (const code of taughtCodes) {
			// a code the atlas stores as a point (Malta, Gibraltar) has size 0:
			// always a dot
			if (metricsOf(world, code).size * ppu < MARKER_PX) set.add(code)
		}
		return set
	}, [world, ppu, taughtCodes])

	/*
	 * Interaction and visuals are separate layers with one uniform rule: a
	 * country's clickable geometry is its hand-authored water shape (`h` in
	 * world.json) when it has one, and its own land otherwise — the event
	 * layer renders `h ?? d` for everything, and the land above it is visuals
	 * only, never receiving a pointer. Hand shapes paint first within the
	 * event layer, so any real geometry beats a hull that reaches too far.
	 * Untaught land sits in the event layer too, code-less: it catches clicks
	 * and resolves to nothing, so a hull can never claim land the app does
	 * not teach — inert by construction, exactly as before.
	 */
	const eventShapes = useMemo(() => {
		const entries = world.shapes.map((sh, i) => ({ sh, i }))
		return entries.sort((a, b) => (a.sh.h ? 0 : 1) - (b.sh.h ? 0 : 1))
	}, [world])
	// the visual twin currently highlighted because its event shape is hovered
	const hoverVis = useRef<Element | null>(null)

	/*
	 * Radii, derived per dot from its surroundings (in map units, so they only
	 * change when the SET changes, not with every resize): the hit circle stays
	 * within half the distance to the nearest fellow dot, and off the boundary
	 * of any nearby taught country that still draws as a shape.
	 */
	const dots = useMemo(() => {
		const codes = [...markerCodes].sort()
		const taughtSet = new Set(taughtCodes)
		const shapesByNearness = world.shapes.filter(sh =>
			sh.c && taughtSet.has(sh.c) && !markerCodes.has(sh.c))
		return codes.map(code => {
			const m = metricsOf(world, code)
			let hit = HIT_R_MAX
			for (const other of codes) {
				if (other === code) continue
				const o = metricsOf(world, other)
				hit = Math.min(hit, Math.hypot(m.x - o.x, m.y - o.y) / 2)
			}
			for (const sh of shapesByNearness) {
				const o = metricsOf(world, sh.c!)
				// prefilter by part-centre distance before walking vertices
				if (Math.hypot(m.x - o.x, m.y - o.y) > o.size + HIT_R_MAX + 4) continue
				hit = Math.min(hit, distanceToCountry(world, sh.c!, m.x, m.y) * 0.9)
			}
			hit = Math.max(hit, 1.2)
			const dot = Math.max(Math.min(DOT_R_MAX, hit * 0.8), 0.9)
			return { code, x: m.x, y: m.y, dot, hit }
		})
	}, [world, markerCodes, taughtCodes])
	// what the viewBox attribute currently shows; null = the whole world
	const shownRef = useRef<MapView | null>(null)
	const animRef = useRef(0)

	/*
	 * The zoom glides instead of jumping: React renders the full-world viewBox
	 * once (a constant, so re-renders never touch it) and this effect tweens
	 * the attribute towards each new `view` — ease-out, geometric on the
	 * scale so the zoom rate feels even, linear on the centre. A view change
	 * mid-flight retargets from wherever the animation is now.
	 */
	useEffect(() => {
		const svg = svgRef.current
		if (!svg) return
		const full: MapView = { x: world.x0 ?? 0, y: 0, w: world.width, h: world.height }
		const from = shownRef.current ?? full
		const to = view ?? full
		const set = (v: MapView) => {
			svg.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`)
			shownRef.current = v
		}
		cancelAnimationFrame(animRef.current)
		if ((from.x === to.x && from.y === to.y && from.w === to.w && from.h === to.h)
			|| window.matchMedia('(prefers-reduced-motion: reduce)').matches
			// rAF is starved in hidden tabs — land on the target rather than stall
			|| document.hidden) {
			set(to)
			return
		}
		const t0 = performance.now()
		const step = (now: number) => {
			const t = Math.min((now - t0) / ZOOM_MS, 1)
			const k = 1 - Math.pow(1 - t, 3)
			const w = from.w * Math.pow(to.w / from.w, k)
			const h = from.h * Math.pow(to.h / from.h, k)
			const cx = (from.x + from.w / 2) + ((to.x + to.w / 2) - (from.x + from.w / 2)) * k
			const cy = (from.y + from.h / 2) + ((to.y + to.h / 2) - (from.y + from.h / 2)) * k
			set({ x: cx - w / 2, y: cy - h / 2, w, h })
			if (t < 1) animRef.current = requestAnimationFrame(step)
		}
		set(from) // frame zero now — feedback must not wait for the first tick
		animRef.current = requestAnimationFrame(step)
		return () => cancelAnimationFrame(animRef.current)
	}, [view, world])

	/*
	 * A new tipOf means the rules changed under the tooltip — game mode turned
	 * on or off, or the interface language switched. Pointer events alone would
	 * not catch it: entering a game from the keyboard, or with the pointer
	 * parked on a country, would leave the old name sitting there.
	 */
	useEffect(() => {
		if (tipRef.current) tipRef.current.hidden = true
	}, [tipOf])

	/*
	 * Keep the tooltip on screen: it sits right of the cursor, but hovering the
	 * far east (Fiji, Japan, New Zealand) used to push it off the edge — there
	 * it flips to the cursor's left instead, and near the top it drops below.
	 */
	const moveTip = (e: React.PointerEvent) => {
		const el = tipRef.current
		if (!el || el.hidden) return
		const margin = 8
		let x = e.clientX + 12
		if (x + tipWidth.current > window.innerWidth - margin) x = e.clientX - 12 - tipWidth.current
		if (x < margin) x = margin
		const y = e.clientY - 34 < margin ? e.clientY + 20 : e.clientY - 34
		el.style.transform = `translate(${x}px, ${y}px)`
	}

	return (
		<div className="map-area">
			<svg
				ref={svgRef}
				className="world-map"
				viewBox={`${world.x0 ?? 0} 0 ${world.width} ${world.height}`}
				role="group"
				onPointerOver={e => {
					if (!hovers(e)) return
					/*
					 * The highlight is not the tooltip: game mode strips every
					 * data-tip (a name on hover would leak the answer) but the
					 * hover fill must survive it. Land never hovers itself, so
					 * light up the visual twin of whatever the pointer is on —
					 * the twin of an event shape is found by shared index, and a
					 * marker dot is its own visuals.
					 */
					hoverVis.current?.classList.remove('hover')
					hoverVis.current = null
					const over = (e.target as Element).closest?.('.hit-shape, g.marker')
					if (over?.classList.contains('marker')) {
						over.classList.add('hover')
						hoverVis.current = over
					} else if (over) {
						const vis = e.currentTarget.querySelector(
							`path.country[data-i="${over.getAttribute('data-i')}"]`)
						vis?.classList.add('hover')
						hoverVis.current = vis
					}
					const hit = (e.target as Element).closest?.('[data-tip]')
					const name = hit?.getAttribute('data-tip')
					const el = tipRef.current
					if (!el) return
					el.hidden = !name
					if (name) {
						const [flagEl, nameEl] = el.children
						// the flag span stays empty for untaught land; CSS hides it then
						if (flagEl) flagEl.textContent = hit?.getAttribute('data-flag') ?? ''
						if (nameEl) nameEl.textContent = name
						// measure after the text lands; used by every move until the next show
						tipWidth.current = el.offsetWidth
					}
					moveTip(e)
				}}
				onPointerMove={moveTip}
				onPointerOut={() => {
					if (tipRef.current) tipRef.current.hidden = true
					hoverVis.current?.classList.remove('hover')
					hoverVis.current = null
				}}
				onClick={e => {
					// the click's position in map units — the matrix knows the viewBox
					const ctm = e.currentTarget.getScreenCTM()
					const point = ctm
						? new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse())
						: null
					onMapClick(codeOf(e.target) ?? null, point && { x: point.x, y: point.y })
				}}
				onKeyDown={e => {
					if (e.key !== 'Enter' && e.key !== ' ') return
					e.preventDefault()
					const code = codeOf(e.target)
					// no point: keyboard selection is exact, never a finger-miss
					if (code) onMapClick(code, null)
				}}
			>
				{/* the event layer: every country's clickable geometry, h ?? d */}
				{eventShapes.map(({ sh, i }) => {
					const state = sh.c ? stateOf(sh.c) : 'unsupported'
					const on = state !== 'unsupported'
					const tip = tipOf(sh)
					return (
						<path
							key={`hit-${sh.c ?? `x${i}`}`}
							d={sh.h ?? sh.d}
							className={`hit-shape${sh.h ? ' hand' : ''}`}
							data-i={i}
							data-code={on ? sh.c : undefined}
							data-tip={tip?.name || undefined}
							data-flag={tip?.flag || undefined}
							tabIndex={on ? 0 : undefined}
							role={on ? 'button' : undefined}
							aria-label={on && sh.c ? nameOf(sh.c) : undefined}
						/>
					)
				})}
				{/* the visual layer: state-colored land, never touched by a pointer */}
				{world.shapes.map((s, i) => {
					const state = s.c ? stateOf(s.c) : 'unsupported'
					return (
						<path
							key={s.c ?? `x${i}`}
							d={s.d}
							className={`country ${state}`}
							data-i={i}
							data-code={s.c && state !== 'unsupported' ? s.c : undefined}
							aria-hidden="true"
						/>
					)
				})}
				{/* after the paths: painted on top, so a dot wins hit-testing over the
				    country it sits inside (a click at Rome's center hits va, not it) */}
				{dots.map(m => {
					const state = stateOf(m.code)
					const on = state !== 'unsupported'
					const tip = tipOf({ c: m.code, n: m.code, d: '' })
					return (
						<g
							key={m.code}
							className={`country marker ${state}`}
							data-code={on ? m.code : undefined}
							data-tip={tip?.name || undefined}
							data-flag={tip?.flag || undefined}
							tabIndex={on ? 0 : undefined}
							role={on ? 'button' : undefined}
							aria-label={on ? nameOf(m.code) : undefined}
						>
							<circle className="dot" cx={m.x} cy={m.y} r={m.dot}/>
							{/* transparent, NOT none — `none` is skipped by hit-testing */}
							<circle className="hit" cx={m.x} cy={m.y} r={m.hit}/>
						</g>
					)
				})}
			</svg>
			{/* the imperative tooltip: React never writes here after mount */}
			<div ref={tipRef} hidden className="map-tooltip">
				<span className="tip-flag flag-emoji"/>
				<span className="tip-name" dir="auto"/>
			</div>
		</div>
	)
})
