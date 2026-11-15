/*
 * The calendar the timeline draws: one year's days, months, weeks and
 * seasons, and the four days the sun turns. Pure functions of a year, so the
 * drawing never does date arithmetic of its own and the tests can pin every
 * edge — a leap year, a year of 53 weeks, a week shared with the next year.
 *
 * Days are counted from 0 = 1 January, in local time: the timeline is about
 * the player's own calendar, so its days begin at their midnight.
 */
import type { SeasonCode } from './seasons/Season'

export type Hemisphere = 'north' | 'south'

const DAY_MS = 86_400_000

// a local date's day of its year, 0 = 1 January
export function dayOfYear(date: Date): number {
	const start = new Date(date.getFullYear(), 0, 1)
	const noon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12)
	// noon, so a clock change in between cannot round a day away
	return Math.floor((noon.getTime() - start.getTime()) / DAY_MS)
}

// the local date of a day of `year`, which may fall in the year before or after
export const dateAt = (year: number, day: number) => new Date(year, 0, 1 + day)

export const daysIn = (year: number) => dayOfYear(new Date(year, 11, 31)) + 1

export type MonthSpan = { index: number, start: number, days: number }

// where each month begins in the year, and how many days it has
export function monthSpans(year: number): MonthSpan[] {
	return Array.from({ length: 12 }, (_, index) => ({
		index,
		start: dayOfYear(new Date(year, index, 1)),
		days: new Date(year, index + 1, 0).getDate(),
	}))
}

/*
 * The ISO 8601 week number: weeks start on Monday, and week 1 is the one
 * holding the year's first Thursday. Sweden counts its veckor this way, as
 * most of Europe does.
 */
export function isoWeek(date: Date): number {
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
	const day = d.getUTCDay() || 7
	// the Thursday of this week decides the year it belongs to
	d.setUTCDate(d.getUTCDate() + 4 - day)
	const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1)
	return Math.ceil(((d.getTime() - yearStart) / DAY_MS + 1) / 7)
}

// the start of the week holding `date`, for weeks that begin on `firstDay`
// (0 = Sunday … 6 = Saturday, as Date counts them)
function weekStart(date: Date, firstDay: number): Date {
	const back = (date.getDay() - firstDay + 7) % 7
	return new Date(date.getFullYear(), date.getMonth(), date.getDate() - back)
}

/*
 * The number of the week that begins on `start`. A week that starts on Monday
 * is numbered by ISO 8601. Any other week is numbered the way the countries
 * that start it on Sunday or Saturday count: week 1 is the week holding
 * 1 January — which makes the last days of December week 1 of the next year,
 * whenever the new year begins before that week ends.
 */
export function weekNumber(start: Date, firstDay: number): number {
	if (firstDay === 1) return isoWeek(start)
	const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6)
	if (end.getFullYear() > start.getFullYear()) return 1
	const first = weekStart(new Date(start.getFullYear(), 0, 1), firstDay)
	const days = Math.round((start.getTime() - first.getTime()) / DAY_MS)
	return Math.floor(days / 7) + 1
}

export type WeekBlock = {
	// the day of the year it starts on: below 0 when it began last year
	start: number,
	// the part of it inside this year, [from, to)
	from: number,
	to: number,
	number: number,
}

/*
 * The year cut into weeks that begin on `firstDay`. The first and the last
 * are usually cut short by the year's edges: a year is 52 weeks and a day or
 * two, so the weeks never fit it exactly.
 */
export function weekBlocks(year: number, firstDay: number): WeekBlock[] {
	const days = daysIn(year)
	// the first week begins this many days before 1 January
	const lead = (new Date(year, 0, 1).getDay() - firstDay + 7) % 7
	const blocks: WeekBlock[] = []
	for (let start = -lead; start < days; start += 7) {
		blocks.push({
			start,
			from: Math.max(start, 0),
			to: Math.min(start + 7, days),
			number: weekNumber(dateAt(year, start), firstDay),
		})
	}
	return blocks
}

// the season each month belongs to, by meteorology, in the north
const NORTH: SeasonCode[] = [
	'winter', 'winter', 'spring', 'spring', 'spring', 'summer',
	'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter',
]
const OPPOSITE: Record<SeasonCode, SeasonCode> = {
	winter: 'summer', summer: 'winter', spring: 'autumn', autumn: 'spring',
}

export const seasonOf = (month: number, hemisphere: Hemisphere): SeasonCode =>
	hemisphere === 'north' ? NORTH[month] : OPPOSITE[NORTH[month]]

export type SeasonRun = { season: SeasonCode, from: number, to: number }

/*
 * The seasons as runs of whole months across the year: five of them, the
 * season of the year's turn coming back at the end of December.
 */
export function seasonRuns(year: number, hemisphere: Hemisphere): SeasonRun[] {
	const runs: SeasonRun[] = []
	for (const m of monthSpans(year)) {
		const season = seasonOf(m.index, hemisphere)
		const last = runs[runs.length - 1]
		if (last && last.season === season) last.to = m.start + m.days
		else runs.push({ season, from: m.start, to: m.start + m.days })
	}
	return runs
}

/*
 * The four days the sun turns: the equinox in March, the solstice in June,
 * the equinox in September and the solstice in December, as instants. By
 * Meeus, Astronomical Algorithms, chapter 27 — the mean instant for the year
 * and the 24 periodic terms of table 27.C, which put it within a minute or so
 * for the years 1000 to 3000; ΔT is taken as the 69 seconds of the 2020s.
 *
 * In the north, June's is the longest day and December's the shortest; in the
 * south the other way round. Which date it falls on depends on where you are:
 * September's equinox in 2026 is the 23rd in Stockholm and the 22nd in New
 * York.
 */
export function sunTurns(year: number): Date[] {
	const y = (year - 2000) / 1000
	const mean = [
		2451623.80984 + 365242.37404 * y + 0.05169 * y ** 2 - 0.00411 * y ** 3 - 0.00057 * y ** 4,
		2451716.56767 + 365241.62603 * y + 0.00325 * y ** 2 + 0.00888 * y ** 3 - 0.00030 * y ** 4,
		2451810.21715 + 365242.01767 * y - 0.11575 * y ** 2 + 0.00337 * y ** 3 + 0.00078 * y ** 4,
		2451900.05952 + 365242.74049 * y - 0.06223 * y ** 2 - 0.00823 * y ** 3 + 0.00032 * y ** 4,
	]
	return mean.map(jde0 => {
		const t = (jde0 - 2451545.0) / 36525
		const w = rad(35999.373 * t - 2.47)
		const dl = 1 + 0.0334 * Math.cos(w) + 0.0007 * Math.cos(2 * w)
		const s = TERMS.reduce((sum, [a, b, c]) => sum + a * Math.cos(rad(b + c * t)), 0)
		const jde = jde0 + (0.00001 * s) / dl
		const ut = jde - 69 / 86_400
		return new Date((ut - 2440587.5) * DAY_MS)
	})
}

const rad = (deg: number) => (deg * Math.PI) / 180

// Meeus, table 27.C: A, B (degrees), C (degrees per Julian century)
const TERMS: readonly [number, number, number][] = [
	[485, 324.96, 1934.136], [203, 337.23, 32964.467], [199, 342.08, 20.186],
	[182, 27.85, 445267.112], [156, 73.14, 45036.886], [136, 171.52, 22518.443],
	[77, 222.54, 65928.934], [74, 296.72, 3034.906], [70, 243.58, 9037.513],
	[58, 119.81, 33718.147], [52, 297.17, 150.678], [50, 21.02, 2281.226],
	[45, 247.54, 29929.562], [44, 325.15, 31555.956], [29, 60.93, 4443.417],
	[18, 155.12, 67555.328], [17, 288.79, 4562.452], [16, 198.04, 62894.029],
	[14, 199.76, 31436.921], [12, 95.39, 14577.848], [12, 287.11, 31931.756],
	[12, 320.81, 34777.259], [9, 227.73, 1222.114], [8, 15.45, 16859.074],
]
