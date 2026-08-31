/*
 * The courtyard's pure edges: turning four tapped animals into the code a
 * link carries, and back.
 *
 * This mapping has been got wrong twice — once in saha's own README and once
 * in a client — for the same reason both times: the alphabet skips I and O,
 * so a letter's position in the alphabet stops matching its ASCII value after
 * H. These tests exist to make that specific mistake loud.
 */
import { describe, it, expect, beforeEach } from 'vitest'

import { ALPHABET, codeOfEmoji, readRoomCode, rememberSeat, recallSeat, forgetSeat } from './saha'

describe('the room alphabet', () => {
	it('skips the letters that get misheard across a room', () => {
		expect(ALPHABET).not.toContain('I')
		expect(ALPHABET).not.toContain('O')
		expect(ALPHABET).toHaveLength(24)
		expect(new Set(ALPHABET).size).toBe(24)
	})

	it('turns tapped animals into a code by position, not by letter', () => {
		expect(codeOfEmoji([0, 1, 2, 3])).toBe('ABCD')
		// position 8 is J, not the ninth letter — this is the trap
		expect(codeOfEmoji([8])).toBe('J')
		expect(codeOfEmoji([13])).toBe('P')
		expect(codeOfEmoji([23])).toBe('Z')
	})

	it('reads a code forgivingly, and refuses one that is not a code', () => {
		expect(readRoomCode(' bkqf ')).toBe('BKQF')
		expect(readRoomCode('BKQ')).toBeNull()   // too short
		expect(readRoomCode('BKQI')).toBeNull()  // not in the alphabet
		expect(readRoomCode('BK QF')).toBeNull()
	})
})

describe('the seat', () => {
	beforeEach(() => sessionStorage.clear())

	it('is kept only for as long as this tab is open', () => {
		expect(recallSeat()).toBeNull()
		rememberSeat({ room: 'BKQF', playerId: 'X2M4Q7', token: 'deadbeef' })
		expect(recallSeat()).toEqual({ room: 'BKQF', playerId: 'X2M4Q7', token: 'deadbeef' })
		forgetSeat()
		expect(recallSeat()).toBeNull()
	})

	it('refuses a half-written seat rather than trying to resume with it', () => {
		sessionStorage.setItem('saha-seat', JSON.stringify({ room: 'BKQF' }))
		expect(recallSeat()).toBeNull()
		sessionStorage.setItem('saha-seat', 'not json at all')
		expect(recallSeat()).toBeNull()
	})
})
