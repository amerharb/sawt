import { useEffect, useRef } from 'react'
import { postSettings } from './sada'

/*
 * Report a language switch to sada — on CHANGE only. The very first render
 * carries the defaults, before the stored settings have even loaded, so it
 * is skipped; the load itself then registers once per visit for anyone whose
 * stored choice differs from the default, and every real switch after that.
 * postSettings carries the off switch and the health gate, so this hook can
 * sit unconditionally in every app.
 */
export function useSadaSettings(app: string, uiLanguage: string, soundLanguage: string): void {
	const first = useRef(true)
	useEffect(() => {
		if (first.current) {
			first.current = false
			return
		}
		postSettings(app, uiLanguage, soundLanguage)
	}, [app, uiLanguage, soundLanguage])
}
