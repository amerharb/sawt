// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { renderHook, cleanup } from '@testing-library/react'
import { usePageLanguage } from './usePageLanguage'

afterEach(() => {
	cleanup()
	document.documentElement.lang = ''
	document.documentElement.removeAttribute('dir')
})

describe('usePageLanguage', () => {
	it('puts the interface language on the page, and follows it when it changes', () => {
		document.documentElement.lang = 'en'
		const { rerender } = renderHook(({ language }) => usePageLanguage(language), { initialProps: { language: 'ar' } })
		expect(document.documentElement.lang).toBe('ar')
		rerender({ language: 'he' })
		expect(document.documentElement.lang).toBe('he')
	})

	it('leaves the reading direction alone', () => {
		renderHook(() => usePageLanguage('ar'))
		expect(document.documentElement.hasAttribute('dir')).toBe(false)
	})
})
