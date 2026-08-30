import { describe, it, expect } from 'vitest'
import { CONTINENTS, CONTINENT_OF, continentOf, groupByContinent, REGIONS, REGION_CODES, regionGroups } from './index'

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

describe('regions', () => {
	it('names only real countries, and never fewer than six', () => {
		for (const region of REGIONS) {
			const codes = REGION_CODES[region]
			expect(codes.length, region).toBeGreaterThanOrEqual(6)
			expect(new Set(codes).size, region).toBe(codes.length)   // no repeats
			for (const c of codes) {
				// a typo here would silently drop a country from its group
				expect(CONTINENT_OF[c], `${region}: ${c}`).toBeDefined()
			}
		}
	})

	it('is a lens, not a partition: overlaps and gaps are both deliberate', () => {
		expect(REGION_CODES.middleEast).toContain('eg')          // Egypt is in both,
		expect(REGION_CODES.northAfrica).toContain('eg')         // by the user's call
		expect(REGION_CODES.balkans).toContain('gr')             // also in southernEurope
		expect(REGION_CODES.southernEurope).toContain('gr')
		const all = new Set(REGIONS.flatMap(r => [...REGION_CODES[r]]))
		expect(all.has('us')).toBe(false)                        // no region is under six
		expect(all.has('au')).toBe(false)
	})

	it('groups in order, keeps item order and drops what an app lacks', () => {
		const items = [{ code: 'jp' }, { code: 'cu' }, { code: 'atlantis' }, { code: 'kr' }]
		expect(regionGroups(items)).toEqual([
			{ region: 'caribbean', items: [{ code: 'cu' }] },
			{ region: 'eastAsia', items: [{ code: 'jp' }, { code: 'kr' }] },
		])
	})
})
