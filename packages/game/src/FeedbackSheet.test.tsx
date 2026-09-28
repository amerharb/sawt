// @vitest-environment jsdom
/*
 * The first test here that renders a component. Globals are off, so
 * cleanup() is called by hand — it also drops the sheet's document-level
 * listeners between cases.
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { FeedbackSheet } from './FeedbackSheet'

afterEach(cleanup)

// an identity translator: labels come back as their keys, which is enough
// to find them and says nothing about any app's wording
const t = (key: string) => key

const setup = (extra: Partial<Parameters<typeof FeedbackSheet>[0]> = {}) => {
	const onSend = vi.fn()
	const onClose = vi.fn()
	const utils = render(
		<FeedbackSheet
			t={t}
			dir="ltr"
			uiLanguages={[{ code: 'en', display: 'English' }, { code: 'ar', display: 'عربي' }]}
			sounds={[{ code: 'en', display: 'English' }, { code: 'de', display: 'Deutsch' }]}
			items={[
				{ code: 'f00', label: 'red', node: <span>R</span> },
				{ code: '0f0', label: 'green', node: <span>G</span> },
			]}
			context={{ version: '0.44.0', uiLanguage: 'en', sound: 'en' }}
			onSend={onSend}
			onClose={onClose}
			{...extra}
		/>,
	)
	const send = () => utils.container.querySelector<HTMLButtonElement>('.feedback-actions button')!
	const kind = () => utils.container.querySelector<HTMLSelectElement>('.feedback-sheet select')!
	return { ...utils, onSend, onClose, send, kind }
}

describe('FeedbackSheet', () => {
	it('is a bug report by default, and will not send without a title', () => {
		const { getByLabelText, send, onSend } = setup()
		expect(send().disabled).toBe(true)
		fireEvent.change(getByLabelText(/feedback.subject/), { target: { value: 'Red is orange' } })
		expect(send().disabled).toBe(false)
		fireEvent.click(send())
		expect(onSend).toHaveBeenCalledTimes(1)
		const [kind, info] = onSend.mock.calls[0]
		expect(kind).toBe('bug')
		// only what was given travels, over the context the app supplied
		expect(info).toEqual({
			version: '0.44.0',
			context: { uiLanguage: 'en', sound: 'en' },
			title: 'Red is orange',
		})
	})

	it('changes its fields with the kind: a link only for an addition, only a message for anything else', () => {
		const { container, kind } = setup()
		const labels = () => [...container.querySelectorAll('.feedback-label')].map(l => l.textContent?.split(' ·')[0])
		expect(labels()).not.toContain('feedback.link')
		fireEvent.change(kind(), { target: { value: 'add' } })
		expect(labels()).toContain('feedback.link')
		fireEvent.change(kind(), { target: { value: 'other' } })
		expect(labels()).toEqual(['feedback.kind', 'feedback.message', 'feedback.email'])
	})

	it('carries the chosen items, languages, and a link that looks like one', () => {
		const { getByLabelText, getByTitle, send, kind, onSend } = setup()
		fireEvent.change(kind(), { target: { value: 'add' } })
		fireEvent.change(getByLabelText(/feedback.subject/), { target: { value: 'Add teal' } })
		fireEvent.change(getByLabelText(/feedback.link/), { target: { value: 'not a link' } })
		expect(send().disabled).toBe(true)          // a link that is not one holds Send off
		fireEvent.change(getByLabelText(/feedback.link/), { target: { value: 'https://example.org/teal.png' } })
		fireEvent.change(getByLabelText(/feedback.uiLanguage/), { target: { value: 'ar' } })
		fireEvent.change(getByLabelText(/feedback.sound/), { target: { value: 'all' } })
		fireEvent.click(getByTitle('green'))
		fireEvent.click(send())
		const [, info] = onSend.mock.calls[0]
		expect(info).toMatchObject({ title: 'Add teal', link: 'https://example.org/teal.png', uiLanguage: 'ar', sound: 'all', items: ['0f0'] })
	})

	it('leaves out the sound and item fields when the app gives none, and reads in the direction it is handed', () => {
		const { container } = setup({ sounds: undefined, items: undefined, dir: 'rtl' })
		const labels = [...container.querySelectorAll('.feedback-label')].map(l => l.textContent?.split(' ·')[0])
		expect(labels).not.toContain('feedback.sound')
		expect(labels).not.toContain('feedback.items')
		expect(container.querySelector('.feedback-sheet')?.getAttribute('dir')).toBe('rtl')
	})

	it('closes on Escape and on a click outside, not on one inside', () => {
		const { container, onClose } = setup()
		fireEvent.mouseDown(container.querySelector('.feedback-sheet')!)
		expect(onClose).not.toHaveBeenCalled()
		fireEvent.mouseDown(document.body)
		expect(onClose).toHaveBeenCalledTimes(1)
		fireEvent.keyDown(document, { key: 'Escape' })
		expect(onClose).toHaveBeenCalledTimes(2)
	})
})
