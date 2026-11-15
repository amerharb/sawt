import { describe, expect, it } from 'vitest'

import { dateAt, dayOfYear, daysIn, isoWeek, monthSpans, seasonRuns, sunTurns, weekBlocks, weekNumber } from './calendar'

const MONDAY = 1
const SUNDAY = 0
const SATURDAY = 6

// a date as yyyy-mm-dd, read in local time
const ymd = (d: Date) =>
	`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// the date an instant falls on in a given place
const dayIn = (instant: Date, timeZone: string) =>
	new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(instant)

describe('the year', () => {
	it('has 365 days, or 366 in a leap year', () => {
		expect(daysIn(2026)).toBe(365)
		expect(daysIn(2028)).toBe(366)
		expect(daysIn(2100)).toBe(365)
	})

	it('counts days from 0 = 1 January', () => {
		expect(dayOfYear(new Date(2026, 0, 1))).toBe(0)
		expect(dayOfYear(new Date(2026, 10, 15))).toBe(318)
		expect(dayOfYear(new Date(2028, 11, 31))).toBe(365)
		expect(ymd(dateAt(2026, -3))).toBe('2025-12-29')
		expect(ymd(dateAt(2026, 367))).toBe('2027-01-03')
	})

	it('lays the months end to end, February short', () => {
		const months = monthSpans(2026)
		expect(months[1]).toEqual({ index: 1, start: 31, days: 28 })
		expect(monthSpans(2028)[1].days).toBe(29)
		expect(months[11].start + months[11].days).toBe(365)
	})
})

describe('the weeks', () => {
	it('numbers a Monday week by ISO 8601', () => {
		expect(isoWeek(new Date(2026, 10, 15))).toBe(46)
		expect(isoWeek(new Date(2025, 11, 29))).toBe(1)
		expect(isoWeek(new Date(2027, 0, 3))).toBe(53)
	})

	it('gives 2026 53 Monday weeks, from 29 December to 3 January', () => {
		const blocks = weekBlocks(2026, MONDAY)
		expect(blocks).toHaveLength(53)
		expect(ymd(dateAt(2026, blocks[0].start))).toBe('2025-12-29')
		expect(blocks[0]).toMatchObject({ from: 0, to: 4, number: 1 })
		const last = blocks[blocks.length - 1]
		expect(ymd(dateAt(2026, last.start + 6))).toBe('2027-01-03')
		expect(last).toMatchObject({ from: 361, to: 365, number: 53 })
	})

	it('gives 2027 52 Monday weeks of its own', () => {
		const blocks = weekBlocks(2027, MONDAY)
		// 2027 begins on a Friday: those three days are week 53 of 2026
		expect(blocks[0].number).toBe(53)
		expect(blocks.slice(1).map(b => b.number)).toEqual(Array.from({ length: 52 }, (_, i) => i + 1))
	})

	it('puts 15 November 2026 in week 46 from Monday and week 47 from Sunday', () => {
		const day = dayOfYear(new Date(2026, 10, 15))
		const of = (firstDay: number) => weekBlocks(2026, firstDay).find(b => day >= b.from && day < b.to)
		expect(of(MONDAY)?.number).toBe(46)
		expect(of(SUNDAY)?.number).toBe(47)
		expect(ymd(dateAt(2026, of(SUNDAY)!.start))).toBe('2026-11-15')
	})

	it('makes the week holding 1 January week 1, for a Sunday or Saturday start', () => {
		expect(weekNumber(new Date(2025, 11, 28), SUNDAY)).toBe(1)
		expect(weekNumber(new Date(2027, 0, 3), SUNDAY)).toBe(2)
		expect(weekNumber(new Date(2026, 11, 27), SUNDAY)).toBe(1)
		const blocks = weekBlocks(2026, SATURDAY)
		expect(ymd(dateAt(2026, blocks[0].start))).toBe('2025-12-27')
		expect(blocks[0].number).toBe(1)
	})

	it('covers every day of the year once', () => {
		for (const firstDay of [0, 1, 2, 3, 4, 5, 6]) {
			const blocks = weekBlocks(2028, firstDay)
			expect(blocks[0].from).toBe(0)
			expect(blocks[blocks.length - 1].to).toBe(366)
			blocks.slice(1).forEach((b, i) => expect(b.from).toBe(blocks[i].to))
		}
	})
})

describe('the seasons', () => {
	it('runs by whole months, winter coming back in December', () => {
		const runs = seasonRuns(2026, 'north')
		expect(runs.map(r => r.season)).toEqual(['winter', 'spring', 'summer', 'autumn', 'winter'])
		expect(runs[1]).toEqual({ season: 'spring', from: 59, to: 151 })
		expect(runs[4]).toEqual({ season: 'winter', from: 334, to: 365 })
	})

	it('swaps in the south', () => {
		expect(seasonRuns(2026, 'south').map(r => r.season)).toEqual(['summer', 'autumn', 'winter', 'spring', 'summer'])
	})
})

describe('the sun', () => {
	it('turns on 20 March, 21 June, 23 September and 21 December 2026 in Stockholm', () => {
		expect(sunTurns(2026).map(t => dayIn(t, 'Europe/Stockholm')))
			.toEqual(['2026-03-20', '2026-06-21', '2026-09-23', '2026-12-21'])
	})

	it('reaches September\'s equinox on the 22nd in New York', () => {
		expect(dayIn(sunTurns(2026)[2], 'America/New_York')).toBe('2026-09-22')
	})

	it('is within minutes of the published instants', () => {
		// 2026: 20 Mar 14:46, 21 Jun 08:24, 23 Sep 00:05, 21 Dec 20:50 UTC
		const published = [Date.UTC(2026, 2, 20, 14, 46), Date.UTC(2026, 5, 21, 8, 24),
			Date.UTC(2026, 8, 23, 0, 5), Date.UTC(2026, 11, 21, 20, 50)]
		sunTurns(2026).forEach((t, i) => expect(Math.abs(t.getTime() - published[i])).toBeLessThan(3 * 60_000))
	})
})
