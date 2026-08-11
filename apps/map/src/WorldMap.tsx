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

export type World = { width: number, height: number, shapes: Shape[] }

// how a country is drawn; every value is a CSS class on its shape
export type CountryState = 'unsupported' | 'idle' | 'clicked' | 'correct' | 'givenUp' | 'wrong'

/*
 * The three teachable countries with no usable geometry at this scale, drawn
 * as dots instead. va and ad exist in world.json only as zero-area degenerate
 * paths — their first coordinate IS their projected location, lifted from the
 * data. gi is absent from the atlas entirely; its point is hand-placed in the
 * Strait, between mainland Spain's southernmost coast (≈485, 137) and
 * Morocco's northernmost (≈486, 138).
 */
const MARKERS = [
	{ code: 'va', x: 532, y: 118.3 },
	{ code: 'ad', x: 504.4, y: 116.3 },
	{ code: 'gi', x: 486.6, y: 137.0 },
]
const MARKER_CODES = new Set(MARKERS.map(m => m.code))

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
	onCountryClick: (code: string) => void,
}

const codeOf = (t: EventTarget | null) =>
	(t as Element | null)?.closest?.('[data-code]')?.getAttribute('data-code')

// mouse and pen hover; touch is handled by click + the display segment
const hovers = (e: React.PointerEvent) => e.pointerType === 'mouse' || e.pointerType === 'pen'

export const WorldMap = memo(function WorldMap({ world, stateOf, tipOf, nameOf, onCountryClick }: Props) {
	const tipRef = useRef<HTMLDivElement>(null)

	const moveTip = (e: React.PointerEvent) => {
		const el = tipRef.current
		if (el && !el.hidden) el.style.transform = `translate(${e.clientX + 12}px, ${e.clientY - 34}px)`
	}

	return (
		<div className="map-area">
			<svg
				className="world-map"
				viewBox={`0 0 ${world.width} ${world.height}`}
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
					const code = codeOf(e.target)
					if (code) onCountryClick(code)
				}}
				onKeyDown={e => {
					if (e.key !== 'Enter' && e.key !== ' ') return
					e.preventDefault()
					const code = codeOf(e.target)
					if (code) onCountryClick(code)
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
							<circle className="dot" cx={m.x} cy={m.y} r={2.5}/>
							{/* transparent, NOT none — `none` is skipped by hit-testing */}
							<circle className="hit" cx={m.x} cy={m.y} r={8}/>
						</g>
					)
				})}
			</svg>
			{/* the imperative tooltip: React never writes here after mount */}
			<div ref={tipRef} hidden className="map-tooltip"><span dir="auto"/></div>
		</div>
	)
})
