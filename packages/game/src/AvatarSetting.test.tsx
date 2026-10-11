// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { AvatarSetting } from './AvatarSetting'
import { AVATARS, preferredAvatar, setPreferredAvatar } from './avatar'

afterEach(cleanup)

const t = (key: string) => key

describe('AvatarSetting', () => {
	it('remembers the animal chosen, and says so to onChange', () => {
		setPreferredAvatar(0)
		const onChange = vi.fn()
		const { getByRole } = render(<AvatarSetting t={t} grid onChange={onChange}/>)
		fireEvent.click(getByRole('option', { name: AVATARS[3] }))
		expect(preferredAvatar()).toBe(3)
		expect(onChange).toHaveBeenCalledWith(3)
	})

	it('says nothing when the animal already chosen is tapped again', () => {
		setPreferredAvatar(2)
		const onChange = vi.fn()
		const { getByRole } = render(<AvatarSetting t={t} grid onChange={onChange}/>)
		fireEvent.click(getByRole('option', { name: AVATARS[2] }))
		expect(onChange).not.toHaveBeenCalled()
	})
})
