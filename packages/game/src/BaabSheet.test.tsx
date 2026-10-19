// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, fireEvent, cleanup, waitFor, act } from '@testing-library/react'
import { BaabSheet } from './BaabSheet'
import type { Baab } from './useBaab'

afterEach(cleanup)

// an identity translator: labels come back as their keys
const t = (key: string) => key

const PROFILE = { handle: 'K7Q4-X2M9', nickname: 'the sawt kid', language: 'en' }

const fakeBaab = (over: Partial<Baab> = {}): Baab => ({
	session: { state: 'out' },
	pending: null,
	arrival: null,
	knock: vi.fn(async () => 'sent' as const),
	enter: vi.fn(async () => 'in' as const),
	leave: vi.fn(async () => {}),
	prove: vi.fn(async () => 'sent' as const),
	erase: vi.fn(async () => 'gone' as const),
	rename: vi.fn(async () => true),
	setLanguage: vi.fn(async () => true),
	forget: vi.fn(),
	settle: vi.fn(),
	...over,
})

const setup = (baab: Baab, dir: 'ltr' | 'rtl' = 'ltr', language?: string) => {
	const onClose = vi.fn()
	const utils = render(<BaabSheet t={t} dir={dir} language={language} baab={baab} onClose={onClose}/>)
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
		await waitFor(() => expect(baab.knock).toHaveBeenCalledWith('parent@example.com', undefined))
	})

	it('asks for the code in the language the page shows', async () => {
		const baab = fakeBaab()
		const { getByLabelText, submit } = setup(baab, 'rtl', 'ar')
		fireEvent.change(getByLabelText('baab.email'), { target: { value: 'parent@example.com' } })
		fireEvent.click(submit())
		await waitFor(() => expect(baab.knock).toHaveBeenCalledWith('parent@example.com', 'ar'))
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
		await waitFor(() => expect(baab.knock).toHaveBeenCalledWith('parent@example.com', undefined))
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

	it('inside: the mail language, saved as it changes and put back when baab refuses', async () => {
		const baab = fakeBaab({ session: { state: 'in', profile: PROFILE } })
		const { getByLabelText, getByRole } = setup(baab)
		const choice = getByLabelText('baab.language') as HTMLSelectElement
		expect(choice.value).toBe('en')
		expect([...choice.options].map(o => o.textContent)).toEqual(['English', 'العربية', 'Deutsch', 'Svenska'])
		await act(async () => { fireEvent.change(choice, { target: { value: 'ar' } }) })
		expect(baab.setLanguage).toHaveBeenCalledWith('ar')
		expect(choice.value).toBe('ar')
		expect(getByRole('status').textContent).toBe('baab.saved')

		const refusing = fakeBaab({ session: { state: 'in', profile: { ...PROFILE, handle: 'P23H-YKGM' } }, setLanguage: vi.fn(async () => false) })
		cleanup()
		const again = setup(refusing)
		const field = again.getByLabelText('baab.language') as HTMLSelectElement
		await act(async () => { fireEvent.change(field, { target: { value: 'de' } }) })
		expect(field.value).toBe('en')
		expect(again.getByRole('status').textContent).toBe('baab.down')
	})

	it('inside: a mail language this build does not know yet shows by its code', () => {
		const baab = fakeBaab({ session: { state: 'in', profile: { ...PROFILE, language: 'el' } } })
		const choice = setup(baab).getByLabelText('baab.language') as HTMLSelectElement
		expect(choice.value).toBe('el')
		expect([...choice.options].map(o => o.value)).toEqual(['en', 'ar', 'de', 'sv', 'el'])
	})

	it('a note from before the delete box does not stand above it, nor one from inside it after Keep it', async () => {
		const baab = fakeBaab({ session: { state: 'in', profile: PROFILE }, erase: vi.fn(async () => 'wrong' as const) })
		const { getByText, getByLabelText, queryByRole, container } = setup(baab)
		// a nickname saved: "Saved." shows
		fireEvent.change(getByLabelText('baab.nickname'), { target: { value: 'Sawt Kid' } })
		await act(async () => { fireEvent.click(getByText('baab.save')) })
		expect(container.querySelector('.baab-alert')?.textContent).toBe('baab.saved')
		// the delete box opens: the old note goes
		fireEvent.click(getByText('baab.delete'))
		expect(container.querySelector('.baab-alert')).toBeNull()
		// a refused code inside the box is said there…
		fireEvent.change(getByLabelText('baab.email'), { target: { value: 'parent@example.com' } })
		await act(async () => { fireEvent.click(getByText('baab.send')) })
		fireEvent.change(getByLabelText('baab.code'), { target: { value: '111111' } })
		await act(async () => { fireEvent.click(getByText('baab.deleteYes')) })
		expect(container.querySelector('.baab-alert')?.textContent).toBe('baab.wrong')
		// …and goes with the box
		fireEvent.click(getByText('baab.deleteCancel'))
		expect(queryByRole('alertdialog')).toBeNull()
		expect(container.querySelector('.baab-alert')).toBeNull()
	})

	it('deleting the account asks for the account\'s email, then the mailed code, before the yes', async () => {
		const baab = fakeBaab({ session: { state: 'in', profile: PROFILE } })
		const { getByText, getByRole, queryByRole, getByLabelText } = setup(baab)
		fireEvent.click(getByText('baab.delete'))
		const box = () => getByRole('alertdialog')
		// step one: the email, and nothing red yet
		expect(box().querySelector('.baab-danger')).toBeNull()
		expect(getByText('baab.deleteCancel').classList.contains('baab-link')).toBe(false)
		const email = getByLabelText('baab.email') as HTMLInputElement
		expect(document.activeElement).toBe(email)
		const send = () => getByText('baab.send') as HTMLButtonElement
		expect(send().disabled).toBe(true)
		fireEvent.change(email, { target: { value: 'parent@example.com' } })
		await act(async () => { fireEvent.click(send()) })
		expect(baab.prove).toHaveBeenCalledWith('parent@example.com')

		// step two: the code unlocks the yes, and only six digits do
		expect(getByText('baab.deleteSent')).toBeTruthy()
		const code = getByLabelText('baab.code') as HTMLInputElement
		expect(document.activeElement).toBe(code)
		const yes = () => box().querySelector<HTMLButtonElement>('.baab-danger')!
		expect(yes().disabled).toBe(true)
		fireEvent.change(code, { target: { value: '12a34' } })
		expect(code.value).toBe('1234')
		expect(yes().disabled).toBe(true)
		fireEvent.change(code, { target: { value: '123456' } })
		expect(yes().disabled).toBe(false)

		// kept: back out, nothing deleted
		fireEvent.click(getByText('baab.deleteCancel'))
		expect(queryByRole('alertdialog')).toBeNull()
		expect(baab.erase).not.toHaveBeenCalled()

		// answered: the code goes to baab
		fireEvent.click(getByText('baab.delete'))
		fireEvent.change(getByLabelText('baab.email'), { target: { value: 'parent@example.com' } })
		await act(async () => { fireEvent.click(send()) })
		fireEvent.change(getByLabelText('baab.code'), { target: { value: '654321' } })
		await act(async () => { fireEvent.click(yes()) })
		expect(baab.erase).toHaveBeenCalledWith('654321')
	})

	it('stays on the email when baab refuses it, and says why', async () => {
		const baab = fakeBaab({ session: { state: 'in', profile: PROFILE }, prove: vi.fn(async () => 'down' as const) })
		const { getByText, getByLabelText, getByRole, queryByText } = setup(baab)
		fireEvent.click(getByText('baab.delete'))
		fireEvent.change(getByLabelText('baab.email'), { target: { value: 'parent@example.com' } })
		await act(async () => { fireEvent.click(getByText('baab.send')) })
		expect(getByRole('status').textContent).toBe('baab.down')
		expect(queryByText('baab.deleteSent')).toBeNull()
	})

	it('opens on what a magic link came to, and reads in the direction it is handed', () => {
		const { getByRole, container } = setup(fakeBaab({ arrival: 'wrong' }), 'rtl')
		expect(getByRole('status').textContent).toBe('baab.linkWrong')
		expect(container.querySelector('.baab-sheet')?.getAttribute('dir')).toBe('rtl')
	})

	it('links the privacy notice under every view, in a tab of its own', () => {
		const views = [
			fakeBaab(),
			fakeBaab({ pending: 'parent@example.com' }),
			fakeBaab({ session: { state: 'in', profile: PROFILE } }),
		]
		for (const baab of views) {
			const { getByText, unmount } = setup(baab)
			const link = getByText('baab.privacy').closest('a')!
			expect(link.getAttribute('href')).toBe('https://sawt.info/privacy')
			expect(link.getAttribute('target')).toBe('_blank')
			expect(link.getAttribute('rel')).toContain('noopener')
			unmount()
		}
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
