/*
 * How the world is grouped, shared by Anthem, Flag and Map — continents
 * first, with room for other groupings (EU, Arab League, …) to join later.
 *
 * Six continents, with Oceania: Australia the country lives inside Oceania
 * together with New Zealand and the Pacific islands; Antarctica is absent
 * from the atlas. Transcontinental calls, made once and easy to revisit:
 * every transcontinental country goes to Asia: Russia, Turkey, Kazakhstan
 * and the Caucasus (ge am az), plus Cyprus with xc — the island stays
 * whole. Egypt stays Africa (the bulk lives west of Suez); the Caribbean
 * and Central America count as North America. Flag's extra codes — the
 * UK's four countries and the EU itself — are Europe.
 */
export type Continent =
	| 'africa'
	| 'asia'
	| 'europe'
	| 'northAmerica'
	| 'southAmerica'
	| 'oceania'

// the fixed display order of the groups
export const CONTINENTS: readonly Continent[] =
	['africa', 'asia', 'europe', 'northAmerica', 'southAmerica', 'oceania']

const AFRICA = [
	'ao', 'bf', 'bi', 'bj', 'bw', 'cd', 'cf', 'cg', 'ci', 'cm', 'cv', 'dj',
	'dz', 'eg', 'eh', 'er', 'et', 'ga', 'gh', 'gm', 'gn', 'gq', 'gw', 'ke',
	'km', 'lr', 'ls', 'ly', 'ma', 'mg', 'ml', 'mr', 'mu', 'mw', 'mz', 'na',
	'ne', 'ng', 'rw', 'sc', 'sd', 'sl', 'sn', 'so', 'ss', 'st', 'sz', 'td',
	'tg', 'tn', 'tz', 'ug', 'za', 'zm', 'zw',
]
const ASIA = [
	'ae', 'af', 'am', 'az', 'bd', 'bh', 'bn', 'bt', 'cn', 'cy', 'ge', 'hk', 'id',
	'in', 'iq', 'ir', 'jo', 'jp', 'kg', 'kh', 'kp', 'kr', 'kw', 'kz', 'la',
	'lb', 'lk', 'mm', 'mn', 'mo', 'mv', 'my', 'np', 'om', 'ph', 'pk', 'ps',
	'qa', 'ru', 'sa', 'sg', 'sy', 'th', 'tj', 'tl', 'tm', 'tr', 'tw', 'uz', 'vn',
	'xc', 'ye',
]
const EUROPE = [
	'ad', 'al', 'at', 'ba', 'be', 'bg', 'by', 'ch', 'cz', 'de', 'dk',
	'ee', 'es', 'eu', 'fi', 'fr', 'gb', 'gb-eng', 'gb-nir', 'gb-sct',
	'gb-wls', 'gi', 'gr', 'hr', 'hu', 'ie', 'is', 'it', 'li', 'lt', 'lu',
	'lv', 'mc', 'md', 'me', 'mk', 'mt', 'nl', 'no', 'pl', 'pt', 'ro', 'rs',
	'se', 'si', 'sk', 'sm', 'ua', 'va', 'xk',
]
const NORTH_AMERICA = [
	'ag', 'bb', 'bs', 'bz', 'ca', 'cr', 'cu', 'dm', 'do', 'gd', 'gl', 'gt',
	'hn', 'ht', 'jm', 'kn', 'lc', 'mx', 'ni', 'pa', 'sv', 'tt', 'us', 'vc',
]
const SOUTH_AMERICA = [
	'ar', 'bo', 'br', 'cl', 'co', 'ec', 'gy', 'pe', 'py', 'sr', 'uy', 've',
]
const OCEANIA = [
	'au', 'fj', 'fm', 'ki', 'mh', 'nr', 'nz', 'pg', 'pw', 'sb', 'to', 'tv',
	'vu', 'ws',
]

export const CONTINENT_OF: Record<string, Continent> = Object.fromEntries([
	...AFRICA.map(c => [c, 'africa'] as const),
	...ASIA.map(c => [c, 'asia'] as const),
	...EUROPE.map(c => [c, 'europe'] as const),
	...NORTH_AMERICA.map(c => [c, 'northAmerica'] as const),
	...SOUTH_AMERICA.map(c => [c, 'southAmerica'] as const),
	...OCEANIA.map(c => [c, 'oceania'] as const),
])

export function continentOf(code: string): Continent | undefined {
	return CONTINENT_OF[code]
}

/*
 * The items grouped for display: groups come in CONTINENTS order, each
 * keeping the incoming item order, empty groups dropped. A code the map does
 * not know lands in a trailing `unclassified` group — a country forgotten
 * here shows up visibly instead of vanishing from the checklist.
 */
export function groupByContinent<T extends { code: string }>(
	items: T[],
): { continent: Continent | 'unclassified', items: T[] }[] {
	const buckets = new Map<Continent | 'unclassified', T[]>()
	for (const item of items) {
		const key = continentOf(item.code) ?? 'unclassified'
		const bucket = buckets.get(key)
		if (bucket) bucket.push(item)
		else buckets.set(key, [item])
	}
	return [...CONTINENTS, 'unclassified' as const]
		.filter(c => buckets.has(c))
		.map(continent => ({ continent, items: buckets.get(continent)! }))
}

/*
 * Regions: a second lens, and deliberately not a partition. A country can sit
 * in several (the Balkans overlap Southern and Eastern Europe) or in none —
 * the United States, Brazil, Australia and the Caucasus belong to no region
 * here, because every group below has at least six members and the leftovers
 * did not. Nothing becomes unreachable: the continents above still cover
 * everyone. The Middle East is the one group that crosses a continent, taking
 * Egypt with it.
 */
export type Region =
	| 'caribbean' | 'centralAmerica' | 'andes'
	| 'northAfrica' | 'westAfrica' | 'centralAfrica' | 'eastAfrica' | 'southernAfrica'
	| 'middleEast' | 'centralAsia' | 'southAsia' | 'southeastAsia' | 'eastAsia'
	| 'northernEurope' | 'westernEurope' | 'southernEurope' | 'easternEurope' | 'balkans'
	| 'pacificIslands'

// the fixed display order: the Americas, Africa, the Middle East, Asia,
// Europe, the Pacific
export const REGIONS: readonly Region[] = [
	'caribbean', 'centralAmerica', 'andes',
	'northAfrica', 'westAfrica', 'centralAfrica', 'eastAfrica', 'southernAfrica',
	'middleEast', 'centralAsia', 'southAsia', 'southeastAsia', 'eastAsia',
	'northernEurope', 'westernEurope', 'southernEurope', 'easternEurope', 'balkans',
	'pacificIslands',
]

export const REGION_CODES: Record<Region, readonly string[]> = {
	caribbean: ['ag', 'bb', 'bs', 'cu', 'dm', 'do', 'gd', 'ht', 'jm', 'kn', 'lc', 'tt', 'vc'],
	centralAmerica: ['bz', 'cr', 'gt', 'hn', 'ni', 'pa', 'sv'],
	andes: ['bo', 'cl', 'co', 'ec', 'pe', 've'],
	northAfrica: ['dz', 'eg', 'eh', 'ly', 'ma', 'mr', 'sd', 'tn'],
	westAfrica: ['bf', 'bj', 'ci', 'cv', 'gh', 'gm', 'gn', 'gw', 'lr', 'ml', 'ne', 'ng', 'sl', 'sn', 'tg'],
	centralAfrica: ['ao', 'cd', 'cf', 'cg', 'cm', 'ga', 'gq', 'st', 'td'],
	eastAfrica: ['bi', 'dj', 'er', 'et', 'ke', 'km', 'mg', 'mu', 'rw', 'sc', 'so', 'ss', 'tz', 'ug'],
	southernAfrica: ['bw', 'ls', 'mw', 'mz', 'na', 'sz', 'za', 'zm', 'zw'],
	// Egypt is in both this and North Africa — overlap is what regions are for
	middleEast: ['ae', 'bh', 'cy', 'eg', 'iq', 'ir', 'jo', 'kw', 'lb', 'om', 'ps', 'qa', 'sa', 'sy', 'tr', 'xc', 'ye'],
	centralAsia: ['af', 'kg', 'kz', 'tj', 'tm', 'uz'],
	southAsia: ['bd', 'bt', 'in', 'lk', 'mv', 'np', 'pk'],
	southeastAsia: ['bn', 'id', 'kh', 'la', 'mm', 'my', 'ph', 'sg', 'th', 'tl', 'vn'],
	eastAsia: ['cn', 'hk', 'jp', 'kp', 'kr', 'mn', 'mo', 'tw'],
	northernEurope: ['dk', 'ee', 'fi', 'gb', 'ie', 'is', 'lt', 'lv', 'no', 'se'],
	westernEurope: ['at', 'be', 'ch', 'de', 'fr', 'li', 'lu', 'mc', 'nl'],
	southernEurope: ['ad', 'al', 'ba', 'es', 'gi', 'gr', 'hr', 'it', 'me', 'mk', 'mt', 'pt', 'rs', 'si', 'sm', 'va', 'xk'],
	easternEurope: ['bg', 'by', 'cz', 'hu', 'md', 'pl', 'ro', 'ru', 'sk', 'ua'],
	// overlaps both European groups above, and earns its place by being the
	// name people actually use
	balkans: ['al', 'ba', 'bg', 'gr', 'hr', 'me', 'mk', 'rs', 'si', 'xk'],
	pacificIslands: ['fj', 'fm', 'ki', 'mh', 'nr', 'pg', 'pw', 'sb', 'to', 'tv', 'vu', 'ws'],
}

/*
 * The items of each region, in REGIONS order, keeping the incoming item order
 * and dropping regions this app has nothing for (Anthem teaches 33 countries,
 * so most regions are empty there).
 */
export function regionGroups<T extends { code: string }>(
	items: T[],
): { region: Region, items: T[] }[] {
	const byCode = new Map(items.map(i => [i.code, i]))
	return REGIONS
		.map(region => ({
			region,
			items: REGION_CODES[region].map(c => byCode.get(c)).filter((i): i is T => !!i),
		}))
		.filter(g => g.items.length > 0)
}
