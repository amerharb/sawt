/*
 * 🧪 dev-only: a toolbar button that shows every round played this page visit
 * as formatted JSON — the RoundResult array, per-target detail included. It
 * renders nothing at all in production: the gate is the same SHOW_BETA flag
 * that hides beta content (true in dev builds and with VITE_SHOW_BETA=true).
 *
 * Styled inline on purpose: it must drop into any app's toolbar without that
 * app shipping CSS for a button its users will never see.
 */
import { useState } from 'react'
import { SHOW_BETA } from '@sawt/feature-flags'
import type { RoundResult } from './useGame'

const buttonStyle: React.CSSProperties = {
	fontSize: 20,
	lineHeight: 1,
	padding: '6px 10px',
	margin: 0,
	borderRadius: 6,
	border: '1px dashed var(--border)',
	background: 'var(--button-bg)',
	color: 'var(--button-fg)',
	cursor: 'pointer',
}

const panelStyle: React.CSSProperties = {
	position: 'fixed',
	inset: '72px 12px 12px 12px',
	zIndex: 1300,
	overflow: 'auto',
	padding: 16,
	border: '1px solid var(--border)',
	borderRadius: 10,
	background: 'var(--bg)',
	color: 'var(--fg)',
	boxShadow: '0 8px 28px rgba(0, 0, 0, 0.28)',
	textAlign: 'left',
}

export function ResultsPeek({ results }: Readonly<{ results: RoundResult[] }>) {
	const [open, setOpen] = useState(false)
	if (!SHOW_BETA) return null
	return (
		<>
			<button
				type="button"
				style={open ? { ...buttonStyle, background: 'var(--active-bg)' } : buttonStyle}
				aria-label="Round results (dev)"
				aria-pressed={open}
				title="Round results (dev only)"
				onClick={() => setOpen(o => !o)}
			>
				🧪
			</button>
			{open && (
				<div style={panelStyle} role="dialog" aria-label="Round results (dev)">
					<pre style={{ margin: 0, font: '12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace', whiteSpace: 'pre-wrap' }}>
						{results.length === 0
							? 'no rounds played yet — start a game 🕹️'
							: JSON.stringify(results, null, 2)}
					</pre>
				</div>
			)}
		</>
	)
}
