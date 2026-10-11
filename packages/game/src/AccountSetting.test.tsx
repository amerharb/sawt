// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { AccountSetting } from './AccountSetting'
import type { Baab } from './useBaab'

afterEach(cleanup)

// an identity translator: labels come back as their keys
const t = (key: string) => key

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

describe('AccountSetting', () => {
	it('says nothing but "one moment" until baab has answered', () => {
		const { container, queryByRole } = render(
			<AccountSetting t={t} baab={fakeBaab({ session: { state: 'unknown' } })} onOpen={vi.fn()}/>,
		)
		expect(container.textContent).toBe('baab.asking')
		expect(queryByRole('button')).toBeNull()
	})

	it('offers the sheet to a player who is signed out', () => {
		const onOpen = vi.fn()
		const { getByRole } = render(<AccountSetting t={t} baab={fakeBaab()} onOpen={onOpen}/>)
		fireEvent.click(getByRole('button', { name: 'baab.open' }))
		expect(onOpen).toHaveBeenCalledOnce()
	})

	it('names a signed-in player by nickname and handle, and signs out in one tap', async () => {
		const baab = fakeBaab({
			session: { state: 'in', profile: { handle: 'K7Q4-X2M9', nickname: 'the sawt kid' } },
		})
		const onOpen = vi.fn()
		const { container, getByRole } = render(<AccountSetting t={t} baab={baab} onOpen={onOpen}/>)
		expect(container.querySelector('.account-name')?.textContent).toBe('the sawt kid')
		expect(container.querySelector('.account-handle')?.textContent).toBe('K7Q4-X2M9')
		fireEvent.click(getByRole('button', { name: 'baab.profile' }))
		expect(onOpen).toHaveBeenCalledOnce()
		fireEvent.click(getByRole('button', { name: 'baab.leave' }))
		await waitFor(() => expect(baab.leave).toHaveBeenCalledOnce())
	})

	it('shows the handle alone when no nickname has been chosen', () => {
		const baab = fakeBaab({ session: { state: 'in', profile: { handle: 'K7Q4-X2M9', nickname: null } } })
		const { container } = render(<AccountSetting t={t} baab={baab} onOpen={vi.fn()}/>)
		expect(container.querySelector('.account-name')).toBeNull()
		expect(container.querySelector('.account-handle')?.textContent).toBe('K7Q4-X2M9')
	})
})
