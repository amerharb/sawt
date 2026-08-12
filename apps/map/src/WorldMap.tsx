import { memo, useRef } from 'react'

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
 * Touch gets no tooltip: on a tap the click plays the name and the display
 * segment shows it, which is the family behaviour everywhere else.
 */

export type Shape = {
	/* ISO 3166-1 alpha-2, lowercase. Absent for territories without one
	   (Kosovo, N. Cyprus …), which are drawn but never interactive. */
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
 * The teachable countries with no usable geometry at this scale, drawn as
 * dots instead. Every position is lifted from the country's own world.json
 * path (its bounding-box centre) — except gi, absent from the atlas
 * entirely, hand-placed in the Strait between mainland Spain's southernmost
 * coast (≈485, 137) and Morocco's northernmost (≈486, 138).
 *
 * dot/hit override the default radii where dots crowd each other — the
 * Lesser Antilles chain (ag kn dm lc vc gd bb, 2.4–4.8 apart) and San Marino
 * next to the Vatican — so no dot's hit circle swallows a neighbour's
 * centre and each stays individually clickable.
 */
const MARKERS: { code: string, x: number, y: number, dot?: number, hit?: number }[] = [
	{ code: 'va', x: 532, y: 118.3 },
	{ code: 'ad', x: 504.4, y: 116.3 },
	{ code: 'gi', x: 486.6, y: 137.0 },
	{ code: 'bh', x: 637.6, y: 170.0 },
	{ code: 'ag', x: 328.9, y: 198.7, dot: 1.1, hit: 1.9 },
	{ code: 'kn', x: 326.5, y: 199.1, dot: 1.1, hit: 1.9 },
	{ code: 'dm', x: 329.3, y: 204.9, dot: 2.0, hit: 3.8 },
	{ code: 'lc', x: 330.1, y: 209.6, dot: 1.5, hit: 2.7 },
	{ code: 'vc', x: 329.1, y: 212.9, dot: 1.5, hit: 2.7 },
	{ code: 'gd', x: 327.6, y: 215.9, dot: 1.5, hit: 2.7 },
	{ code: 'bb', x: 334.0, y: 212.4, dot: 2.0, hit: 3.8 },
	{ code: 'sm', x: 531.8, y: 111.8, hit: 5 },
	{ code: 'mc', x: 518.9, y: 112.3 },
	{ code: 'li', x: 523.9, y: 101.3 },
	{ code: 'mt', x: 538.0, y: 137.7 },
	{ code: 'sc', x: 656.0, y: 270.3 },
	{ code: 'mv', x: 706.5, y: 243.0 },
	{ code: 'sg', x: 792.3, y: 250.7 },
	{ code: 'pw', x: 873.1, y: 238.1 },
	{ code: 'mh', x: 974.0, y: 227.4 },
	{ code: 'nr', x: 969.5, y: 256.7 },
	{ code: 'tv', x: 1002.5, y: 282.9 },
]
const MARKER_CODES = new Set(MARKERS.map(m => m.code))

// a zoomed-in window on the map, in map units; null shows the whole world
export type MapView = { x: number, y: number, w: number, h: number }

/* distance in map units from a point to a country — to its dot for the
 * marker countries, to the nearest path vertex for the rest (a boundary
 * approximation, plenty for judging a near-miss). Parsed vertices are cached:
 * the atlas is static for the session. */
const pointsCache = new Map<string, [number, number][]>()
export function distanceToCountry(world: World, code: string, x: number, y: number): number {
	const marker = MARKERS.find(m => m.code === code)
	if (marker) return Math.hypot(x - marker.x, y - marker.y)
	let pts = pointsCache.get(code)
	if (!pts) {
		const d = world.shapes.find(s => s.c === code)?.d ?? ''
		pts = [...d.matchAll(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g)].map(m => [Number(m[1]), Number(m[2])])
		pointsCache.set(code, pts)
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
	// tooltip text for a shape, or null for none (game mode returns null for
	// everything, so hovering cannot reveal the answer)
	tipOf: (shape: Shape) => string | null,
	// accessible name for a teachable country (always on, in game mode too — a
	// screen reader finding the target by name is access, not cheating)
	nameOf: (code: string) => string,
	/* every click on the map, teachable country or not: its code (null for
	   ocean and untaught land) and where it landed in map units (null when
	   there is no point, i.e. keyboard activation) */
	onMapClick: (code: string | null, point: { x: number, y: number } | null) => void,
	// the zoomed-in window (near-miss forgiveness in the game); null = whole world
	view: MapView | null,
}

const codeOf = (t: EventTarget | null) =>
	(t as Element | null)?.closest?.('[data-code]')?.getAttribute('data-code')

// mouse and pen hover; touch is handled by click + the display segment
const hovers = (e: React.PointerEvent) => e.pointerType === 'mouse' || e.pointerType === 'pen'

export const WorldMap = memo(function WorldMap({ world, stateOf, tipOf, nameOf, onMapClick, view }: Props) {
	const tipRef = useRef<HTMLDivElement>(null)

	const moveTip = (e: React.PointerEvent) => {
		const el = tipRef.current
		if (el && !el.hidden) el.style.transform = `translate(${e.clientX + 12}px, ${e.clientY - 34}px)`
	}

	return (
		<div className="map-area">
			<svg
				className="world-map"
				viewBox={view
					? `${view.x} ${view.y} ${view.w} ${view.h}`
					: `${world.x0 ?? 0} 0 ${world.width} ${world.height}`}
				role="group"
				onPointerOver={e => {
					if (!hovers(e)) return
					const tip = (e.target as Element).closest?.('[data-tip]')?.getAttribute('data-tip')
					const el = tipRef.current
					if (!el) return
					el.hidden = !tip
					if (tip && el.firstElementChild) el.firstElementChild.textContent = tip
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
					// the marker countries' paths are sub-pixel; the dots replace them
					if (s.c && MARKER_CODES.has(s.c)) return null
					const state = s.c ? stateOf(s.c) : 'unsupported'
					const on = state !== 'unsupported'
					const tip = tipOf(s)
					return (
						<path
							key={s.c ?? `x${i}`}
							d={s.d}
							className={`country ${state}`}
							data-code={on ? s.c : undefined}
							data-tip={tip ?? undefined}
							tabIndex={on ? 0 : undefined}
							role={on ? 'button' : undefined}
							aria-label={on && s.c ? nameOf(s.c) : undefined}
						/>
					)
				})}
				{/* after the paths: painted on top, so a dot wins hit-testing over the
				    country it sits inside (a click at Rome's centre hits va, not it) */}
				{MARKERS.map(m => {
					const state = stateOf(m.code)
					const on = state !== 'unsupported'
					const tip = tipOf({ c: m.code, n: m.code, d: '' })
					return (
						<g
							key={m.code}
							className={`country marker ${state}`}
							data-code={on ? m.code : undefined}
							data-tip={tip ?? undefined}
							tabIndex={on ? 0 : undefined}
							role={on ? 'button' : undefined}
							aria-label={on ? nameOf(m.code) : undefined}
						>
							<circle className="dot" cx={m.x} cy={m.y} r={m.dot ?? 2.5}/>
							{/* transparent, NOT none — `none` is skipped by hit-testing */}
							<circle className="hit" cx={m.x} cy={m.y} r={m.hit ?? 8}/>
						</g>
					)
				})}
			</svg>
			{/* the imperative tooltip: React never writes here after mount */}
			<div ref={tipRef} hidden className="map-tooltip"><span dir="auto"/></div>
		</div>
	)
})
