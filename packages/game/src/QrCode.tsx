/*
 * The invite link as something a phone camera can read.
 *
 * Two children in one room have the number read out loud; two children in
 * different rooms of the same house have a link. This is the third case, and
 * the one the other two are worst at: the friend is standing right there with
 * their own tablet, and reading a URL aloud is nobody's idea of a good time.
 *
 * DRAWN DARK-ON-WHITE, ALWAYS, whatever the app's theme is. An inverted QR is
 * not a QR to most scanners — they look for dark modules on a light ground —
 * so this one brings its own white, including the four-module quiet zone the
 * spec asks for. It is the one thing on these screens that ignores dark mode
 * on purpose.
 *
 * The modules become a single <path> rather than several hundred <rect>s: same
 * picture, one element, and it scales to whatever box it is given.
 */
import { useMemo } from 'react'
import qrcode from 'qrcode-generator'

/** The quiet zone, in modules. Four is what the specification asks for. */
const QUIET = 4

export function QrCode({ value, label }: Readonly<{ value: string, label?: string }>) {
	const drawn = useMemo(() => {
		/*
		 * Type 0 picks the smallest symbol the data fits in, and 'M' is the
		 * middle error-correction level — about 15% of the code can be a
		 * thumb, a fold or a reflection and it still reads.
		 */
		const qr = qrcode(0, 'M')
		qr.addData(value)
		qr.make()
		const count = qr.getModuleCount()
		let path = ''
		for (let row = 0; row < count; row++) {
			for (let col = 0; col < count; col++) {
				if (qr.isDark(row, col)) {
					path += `M${col + QUIET} ${row + QUIET}h1v1h-1z`
				}
			}
		}
		return { path, span: count + QUIET * 2 }
	}, [value])

	return (
		<svg
			className="race-qr-code"
			viewBox={`0 0 ${drawn.span} ${drawn.span}`}
			role="img"
			aria-label={label ?? value}
		>
			<rect width={drawn.span} height={drawn.span} fill="#fff"/>
			<path d={drawn.path} fill="#000"/>
		</svg>
	)
}
