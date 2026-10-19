import { useEffect } from 'react'

/*
 * The page says which language it is in: `<html lang>` follows the
 * interface language, so a screen reader speaks Arabic in an Arabic voice
 * rather than spelling it out in an English one, and a browser's own
 * translation starts from the right language. Every index.html is served as
 * `lang="en"`; this corrects it once the app knows its language, and again
 * whenever the player changes it.
 *
 * Only the language: the reading direction is not set here. The apps keep
 * their boards, toolbars and panels as they are in every language, and give
 * `dir` to the parts that read in it — the sheets, and in Week and Anthem
 * the board — so a page-wide `dir` would turn far more than it means to.
 */
export function usePageLanguage(language: string): void {
	useEffect(() => {
		document.documentElement.lang = language
	}, [language])
}
