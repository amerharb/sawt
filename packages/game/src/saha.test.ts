// @vitest-environment jsdom
/*
 * The courtyard's pure edges: reading the six digits of a room code, whatever
 * shape they arrive in.
 *
 * The seat needs a browser, hence the environment above. Node 26 happens to
 * ship sessionStorage as a global, so without it these tests pass on a new
 * enough machine and fail on CI's Node 24 — which is precisely what happened.
 * The environment a test needs belongs in the test, not in the runtime that
 * runs it.
 *
 * The trap here is the leading zeros. A code is six *characters*, not a number
 * that happens to be small, and every one of these tests exists because
 * `parseInt` would quietly turn `004271` into a room nobody is in.
 */
import { describe, it, expect, beforeEach } from 'vitest'

import { MIN_SAHA_VERSION, atLeast, digitsOf, readRoomCode, rememberSeat, recallSeat, forgetSeat } from './saha'

describe('a room code', () => {
	it('keeps its leading zeros, because they are part of the code', () => {
		expect(readRoomCode('004271')).toBe('004271')
		expect(readRoomCode('000000')).toBe('000000')
		// what a number would have made of them
		expect(readRoomCode('4271')).toBeNull()
		expect(String(Number('004271'))).toBe('4271')
	})

	it('is read forgivingly, in the shapes people write six digits in', () => {
		expect(readRoomCode(' 004 271 ')).toBe('004271')
		expect(readRoomCode('004-271')).toBe('004271')
	})

	it('accepts the digits on the keyboard the child actually has', () => {
		// Arabic-Indic and its Persian/Urdu variant, normalised to ASCII so the
		// screen and the server always agree on what the room is called
		expect(readRoomCode('٠٠٤٢٧١')).toBe('004271')
		expect(readRoomCode('۰۰۴۲۷۱')).toBe('004271')
		expect(readRoomCode('٠٠4٢7١')).toBe('004271')
	})

	it('refuses anything that is not six digits', () => {
		expect(readRoomCode('04271')).toBeNull()    // five
		expect(readRoomCode('0042715')).toBeNull()  // seven
		expect(readRoomCode('BKQF')).toBeNull()     // the old shape
		expect(readRoomCode('00427x')).toBeNull()
		expect(readRoomCode('')).toBeNull()
	})

	it('throws away everything that is not a digit as it is typed', () => {
		// what a paste, a stray letter or a long press can put in the field
		expect(digitsOf('00-42 71')).toBe('004271')
		expect(digitsOf('hello')).toBe('')
		expect(digitsOf('4a2b7c')).toBe('427')
	})
})

describe('the server version this build needs', () => {
	it('compares the fields as numbers, not as text', () => {
		// the trap: as text '0.10.0' sorts below '0.4.0', so a lexical compare
		// would refuse a server that is six releases too new
		expect(atLeast('0.10.0', '0.4.0')).toBe(true)
		expect(atLeast('0.4.0', '0.10.0')).toBe(false)
		expect(atLeast('1.0.0', '0.9.9')).toBe(true)
	})

	it('accepts exactly the minimum, and anything above it', () => {
		expect(atLeast('0.4.0', '0.4.0')).toBe(true)
		expect(atLeast('0.4.1', '0.4.0')).toBe(true)
		expect(atLeast('0.5.0', '0.4.0')).toBe(true)
	})

	it('refuses a server that is behind this build', () => {
		expect(atLeast('0.3.0', '0.4.0')).toBe(false)
		expect(atLeast('0.2.9', '0.4.0')).toBe(false)
	})

	it('treats anything it cannot read as too old', () => {
		// a health body with no version, a proxy's error page, half a number:
		// none of them is a saha this build knows how to talk to
		expect(atLeast('', '0.4.0')).toBe(false)
		expect(atLeast('0.4', '0.4.0')).toBe(false)
		expect(atLeast('what', '0.4.0')).toBe(false)
	})

	it('reads a pre-release as the version it is a candidate for', () => {
		expect(atLeast('1.0.0-rc1', '0.4.0')).toBe(true)
	})

	it('names a real version as its minimum', () => {
		// the constant is the client's requirement, so it must at least parse
		expect(atLeast(MIN_SAHA_VERSION, MIN_SAHA_VERSION)).toBe(true)
	})
})

describe('the seat', () => {
	beforeEach(() => sessionStorage.clear())

	it('is kept only for as long as this tab is open', () => {
		expect(recallSeat()).toBeNull()
		rememberSeat({ room: '004271', playerId: 'X2M4Q7', token: 'deadbeef' })
		expect(recallSeat()).toEqual({ room: '004271', playerId: 'X2M4Q7', token: 'deadbeef' })
		forgetSeat()
		expect(recallSeat()).toBeNull()
	})

	it('refuses a half-written seat rather than trying to resume with it', () => {
		sessionStorage.setItem('saha-seat', JSON.stringify({ room: '004271' }))
		expect(recallSeat()).toBeNull()
		sessionStorage.setItem('saha-seat', 'not json at all')
		expect(recallSeat()).toBeNull()
	})
})
