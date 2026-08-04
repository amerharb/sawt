import { useCallback, useEffect, useRef, useState } from 'react'

/*
 * 'idle' until the button is pressed, then 'copied' or 'failed' for a moment
 * before going back — long enough to read, short enough that the button is ready
 * again if the first attempt did not take.
 */
export type CopyStatus = 'idle' | 'copied' | 'failed'

const RESET_MS = 1500

/*
 * What the button shows per status, and the i18n key for its tooltip. Shared
 * rather than repeated in five panels so the button reads the same everywhere —
 * the keys live here too, since all five apps use these same three.
 */
export const COPY_ICON: Record<CopyStatus, string> = {
	idle: '🔗',
	copied: '✅',
	failed: '⚠️',
}

export const COPY_TITLE: Record<CopyStatus, string> = {
	idle: 'share.copyTitle',
	copied: 'share.copied',
	failed: 'share.failed',
}

/*
 * Copy a share link to the clipboard, reporting what happened.
 *
 * `navigator.clipboard` needs a secure context, so it is missing over plain HTTP
 * on a phone on the local network — a real way these apps get opened. It can also
 * reject when the page is not focused or permission is refused. Both fall back to
 * the old select-and-execCommand trick, which needs no permission; only if that
 * fails too does the button report a failure, so the visitor is never left
 * thinking a link was copied when it was not.
 */
export function useCopyLink(): { status: CopyStatus, copy: (text: string) => Promise<void> } {
	const [status, setStatus] = useState<CopyStatus>('idle')
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

	// a pending reset must not fire onto an unmounted panel
	useEffect(() => () => {
		if (timer.current !== null) clearTimeout(timer.current)
	}, [])

	const copy = useCallback(async (text: string) => {
		const ok = await writeClipboard(text)
		setStatus(ok ? 'copied' : 'failed')
		if (timer.current !== null) clearTimeout(timer.current)
		timer.current = setTimeout(() => setStatus('idle'), RESET_MS)
	}, [])

	return { status, copy }
}

async function writeClipboard(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text)
		return true
	} catch {
		return legacyCopy(text)
	}
}

// Copy via a throwaway off-screen textarea. Deprecated, but it is the only path
// that works without a secure context or a permission prompt.
function legacyCopy(text: string): boolean {
	try {
		const field = document.createElement('textarea')
		field.value = text
		// off-screen rather than hidden: a display:none field cannot be selected,
		// and readOnly stops the mobile keyboard appearing for the instant it exists
		field.setAttribute('readonly', '')
		field.style.position = 'fixed'
		field.style.top = '-1000px'
		document.body.appendChild(field)
		field.select()
		const ok = document.execCommand('copy')
		field.remove()
		return ok
	} catch {
		return false
	}
}
