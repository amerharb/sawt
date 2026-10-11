// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { BaabSheet } from './BaabSheet'
import type { Baab } from './useBaab'

afterEach(cleanup)

// an identity translator: labels come back as their keys
const t = (key: string) => key

const PROFILE = { handle: 'K7Q4-X2M9', nickname: 'the sawt kid' }

const fakeBaab = (over: Partial<Baab> = {}): Baab => ({
	session: { state: 'out' },
	pending: null,
	arrival: null,
	knock: vi.fn(async () => 'sent' as const),
	enter: vi.fn(async () => 'in' as const),
	leave: vi.fn(async () => {}),
	rename: vi.fn(async () => true),
	forget: vi.fn(),
	settle: vi.fn(),
	...over,
})

const setup = (baab: Baab, dir: 'ltr' | 'rtl' = 'ltr') => {
	const onClose = vi.fn()
	const utils = render(<BaabSheet t={t} dir={dir} baab={baab} onClose={onClose}/>)
	const submit = () => utils.container.querySelector<HTMLButtonElement>('.baab-actions button[type=submit]')!
	return { ...utils, onClose, submit }
}

describe('BaabSheet', () => {
	it('asks for an email first, and knocks only with one that looks like one', async () => {
		const baab = fakeBaab()
		const { getByLabelText, submit } = setup(baab)
		expect(submit().textContent).toBe('baab.send')
		expect(submit().disabled).toBe(true)
		fireEvent.change(getByLabelText('baab.email'), { target: { value: 'not an email' } })
		expect(submit().disabled).toBe(true)
		fireEvent.change(getByLabelText('baab.email'), { target: { value: 'parent@example.com' } })
		expect(submit().disabled).toBe(false)
		fireEvent.click(submit())
		await waitFor(() => expect(baab.knock).toHaveBeenCalledWith('parent@example.com'))
	})

	it('says why a knock did not go through', async () => {
		const baab = fakeBaab({ knock: vi.fn(async () => 'wait' as const) })
		const { getByLabelText, submit, getByRole } = setup(baab)
		fireEvent.change(getByLabelText('baab.email'), { target: { value: 'parent@example.com' } })
		fireEvent.click(submit())
		await waitFor(() => expect(getByRole('status').textContent).toBe('baab.wait'))
	})

	it('once a code is out, takes six digits and nothing else, and offers the ways back', async () => {
		const baab = fakeBaab({ pending: 'parent@example.com' })
		const { container, getByLabelText, getByText, submit } = setup(baab)
		expect(container.querySelector('.baab-address')?.textContent).toBe('parent@example.com')
		const code = getByLabelText('baab.code') as HTMLInputElement
		fireEvent.change(code, { target: { value: '12a34' } })
		expect(code.value).toBe('1234')             // digits only
		expect(submit().disabled).toBe(true)
		fireEvent.change(code, { target: { value: '123456' } })
		expect(submit().disabled).toBe(false)
		fireEvent.click(submit())
		await waitFor(() => expect(baab.enter).toHaveBeenCalledWith('123456'))

		fireEvent.click(getByText('baab.again'))
		await waitFor(() => expect(baab.knock).toHaveBeenCalledWith('parent@example.com'))
		fireEvent.click(getByText('baab.another'))
		expect(baab.forget).toHaveBeenCalled()
	})

	it('inside: the handle, the nickname with Save only for a real change, and the way out', async () => {
		const baab = fakeBaab({ session: { state: 'in', profile: PROFILE } })
		const { container, getByLabelText, getByText } = setup(baab)
		expect(container.querySelector('.baab-handle')?.textContent).toBe('K7Q4-X2M9')
		const save = getByText('baab.save') as HTMLButtonElement
		expect(save.disabled).toBe(true)            // unchanged: nothing to save
		fireEvent.change(getByLabelText('baab.nickname'), { target: { value: '  ' } })
		expect(save.disabled).toBe(true)            // empty: baab would refuse it
		fireEvent.change(getByLabelText('baab.nickname'), { target: { value: 'Sawt Kid' } })
		expect(save.disabled).toBe(false)
		fireEvent.click(save)
		await waitFor(() => expect(baab.rename).toHaveBeenCalledWith('Sawt Kid'))
		fireEvent.click(getByText('baab.leave'))
		await waitFor(() => expect(baab.leave).toHaveBeenCalled())
	})

	it('opens on what a magic link came to, and reads in the direction it is handed', () => {
		const { getByRole, container } = setup(fakeBaab({ arrival: 'wrong' }), 'rtl')
		expect(getByRole('status').textContent).toBe('baab.linkWrong')
		expect(container.querySelector('.baab-sheet')?.getAttribute('dir')).toBe('rtl')
	})

	it('closes on ✕, Escape and a click outside — not on one inside', () => {
		const { container, onClose, getByLabelText } = setup(fakeBaab())
		fireEvent.mouseDown(container.querySelector('.baab-sheet')!)
		expect(onClose).not.toHaveBeenCalled()
		fireEvent.mouseDown(document.body)
		fireEvent.keyDown(document, { key: 'Escape' })
		fireEvent.click(getByLabelText('baab.close'))
		expect(onClose).toHaveBeenCalledTimes(3)
	})
})
