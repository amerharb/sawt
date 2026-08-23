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
 * Dot positions are the largest part's centre, with two hand-held exceptions
 * the geometry cannot know: Gibraltar is absent from the atlas entirely, and
 * the Pearl River Delta pair sits 1.6 units (~60 km) apart — nudged 0.7 each
 * way along their own axis, Macau west, Hong Kong east, as in life.
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
const MARKER_PX = 3
// visible dot and hit circle, in map units — the open-water maximums
const DOT_R_MAX = 2.5
const HIT_R_MAX = 8

const POSITION_OVERRIDES: Record<string, { x: number, y: number }> = {
	// absent from the atlas: hand-placed in the Strait between mainland
	// Spain's southernmost coast (≈485, 137) and Morocco's northernmost (≈486, 138)
	gi: { x: 486.6, y: 137.0 },
	mo: { x: 811.2, y: 182.9 },
	hk: { x: 813.9, y: 181.7 },
}

type Metrics = { size: number, x: number, y: number }
const metricsCache = new Map<string, Metrics>()
// √(w·h) of the country's largest single part, and that part's centre
function metricsOf(world: World, code: string): Metrics {
	let m = metricsCache.get(code)
	if (m) return m
	const d = world.shapes.find(s => s.c === code)?.d ?? ''
	let best: Metrics = { size: 0, x: 0, y: 0 }
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
		if (size >= best.size) best = { size, x: (minX + maxX) / 2, y: (minY + maxY) / 2 }
	}
	const o = POSITION_OVERRIDES[code]
	m = o ? { size: best.size, x: o.x, y: o.y } : best
	metricsCache.set(code, m)
	return m
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
		// no geometry at all (Gibraltar): its dot is the country
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
	// ever drawn as dots, and a taught code absent from the atlas (Gibraltar)
	// exists ONLY as a dot; untaught land stays inert geometry
	taughtCodes: readonly string[],
}

const codeOf = (t: EventTarget | null) =>
	(t as Element | null)?.closest?.('[data-code]')?.getAttribute('data-code')

// mouse and pen hover; touch is handled by click + the display segment
const hovers = (e: React.PointerEvent) => e.pointerType === 'mouse' || e.pointerType === 'pen'

export const WorldMap = memo(function WorldMap({ world, stateOf, tipOf, nameOf, onMapClick, view, taughtCodes }: Props) {
	const tipRef = useRef<HTMLDivElement>(null)
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
			// a code with no geometry at all (Gibraltar) has size 0: always a dot
			if (metricsOf(world, code).size * ppu < MARKER_PX) set.add(code)
		}
		return set
	}, [world, ppu, taughtCodes])

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

	const moveTip = (e: React.PointerEvent) => {
		const el = tipRef.current
		if (el && !el.hidden) el.style.transform = `translate(${e.clientX + 12}px, ${e.clientY - 34}px)`
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
					}
					moveTip(e)
				}}
				onPointerMove={moveTip}
				onPointerOut={() => {
					if (tipRef.current) tipRef.current.hidden = true
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
				{world.shapes.map((s, i) => {
					// a marker country's path is sub-pixel right now; its dot replaces it
					if (s.c && markerCodes.has(s.c)) return null
					const state = s.c ? stateOf(s.c) : 'unsupported'
					const on = state !== 'unsupported'
					const tip = tipOf(s)
					return (
						<path
							key={s.c ?? `x${i}`}
							d={s.d}
							className={`country ${state}`}
							data-code={on ? s.c : undefined}
							data-tip={tip?.name || undefined}
							data-flag={tip?.flag || undefined}
							tabIndex={on ? 0 : undefined}
							role={on ? 'button' : undefined}
							aria-label={on && s.c ? nameOf(s.c) : undefined}
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
