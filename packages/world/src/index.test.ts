import { describe, it, expect } from 'vitest'
import { CONTINENTS, CONTINENT_OF, continentOf, groupByContinent } from './index'

describe('the continent map', () => {
	it('covers the world and only uses the six continents', () => {
		const codes = Object.keys(CONTINENT_OF)
		expect(codes.length).toBeGreaterThanOrEqual(200)
		expect(new Set(codes).size).toBe(codes.length) // no code claimed twice
		for (const c of Object.values(CONTINENT_OF)) {
			expect(CONTINENTS).toContain(c)
		}
	})

	it('makes the agreed transcontinental calls', () => {
		expect(continentOf('ru')).toBe('asia')     // every transcontinental goes east
		expect(continentOf('tr')).toBe('asia')
		expect(continentOf('cy')).toBe('asia')     // the UN's geographic call
		expect(continentOf('xc')).toBe('asia')     // the island stays whole
		expect(continentOf('eg')).toBe('africa')
		expect(continentOf('tt')).toBe('northAmerica') // the Caribbean
		expect(continentOf('fj')).toBe('oceania')
		expect(continentOf('au')).toBe('oceania')  // the country, inside Oceania
		expect(continentOf('gb-sct')).toBe('europe')
		expect(continentOf('atlantis')).toBeUndefined()
	})

	it('groups in continent order, keeps item order, exposes the forgotten', () => {
		const items = [
			{ code: 'nz' }, { code: 'se' }, { code: 'atlantis' }, { code: 'no' }, { code: 'eg' },
		]
		expect(groupByContinent(items)).toEqual([
			{ continent: 'africa', items: [{ code: 'eg' }] },
			{ continent: 'europe', items: [{ code: 'se' }, { code: 'no' }] },
			{ continent: 'oceania', items: [{ code: 'nz' }] },
			{ continent: 'unclassified', items: [{ code: 'atlantis' }] },
		])
	})
})
