// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSadaSettings } from './useSadaSettings'
import { postSettings } from './sada'

vi.mock('./sada', () => ({ postSettings: vi.fn() }))

afterEach(() => {
	vi.clearAllMocks()
})

describe('useSadaSettings', () => {
	it('says nothing on first render, pings every change after', () => {
		const h = renderHook(
			({ ui, sound }) => useSadaSettings('flag', ui, sound),
			{ initialProps: { ui: 'en', sound: 'en' } },
		)
		expect(postSettings).not.toHaveBeenCalled()      // the defaults are not a choice

		h.rerender({ ui: 'ar', sound: 'en' })            // interface language switched
		expect(postSettings).toHaveBeenCalledWith('flag', 'ar', 'en')

		h.rerender({ ui: 'ar', sound: 'sv' })            // hearing language switched
		expect(postSettings).toHaveBeenCalledWith('flag', 'ar', 'sv')
		expect(postSettings).toHaveBeenCalledTimes(2)

		h.rerender({ ui: 'ar', sound: 'sv' })            // nothing changed: silence
		expect(postSettings).toHaveBeenCalledTimes(2)
	})
})
