# TODO — countries left for Flag and Map

The campaign: every country in both [Flag](apps/flag) and [Map](apps/map),
added in batches of ten, biggest by area first, English recording only to
start (`sounds: ['en']` — see each app's README for how partial coverage
behaves). 164 are in so far (see the changelog); these remain, in area order.

Every entry below already has its flag glyph in `flags.woff2`. "tiny shape"
means the world.json geometry exists but is a speck at world scale — when a
batch reaches those, decide by eye which get promoted to dot markers, the way
Vatican City, Andorra and Gibraltar are drawn in Map.

| # | code | country | area km² | note |
| --- | --- | --- | --- | --- |
| 1 | `eh` | 🇪🇭 Western Sahara | 266,000 | disputed territory |
| 2 | `tw` | 🇹🇼 Taiwan | 36,193 | not a UN member |
| 3 | `gm` | 🇬🇲 Gambia | 11,295 | |
| 4 | `jm` | 🇯🇲 Jamaica | 10,991 | |
| 5 | `xk` | 🇽🇰 Kosovo | 10,887 | its world.json shape is code-less — stamp `c: 'xk'` on it, which is a world.json regeneration and needs the `cacheVersion` bump in Map's `audioCache.ts` |
| 6 | `cy` | 🇨🇾 Cyprus | 9,251 | |
| 7 | `bn` | 🇧🇳 Brunei | 5,765 | |
| 8 | `tt` | 🇹🇹 Trinidad and Tobago | 5,130 | |
| 9 | `cv` | 🇨🇻 Cape Verde | 4,033 | |
| 10 | `ws` | 🇼🇸 Samoa | 2,842 | |
| 11 | `km` | 🇰🇲 Comoros | 2,235 | |
| 12 | `mu` | 🇲🇺 Mauritius | 2,040 | |
| 13 | `st` | 🇸🇹 São Tomé and Príncipe | 964 | |
| 14 | `ki` | 🇰🇮 Kiribati | 811 | shape straddles the dateline |
| 15 | `bh` | 🇧🇭 Bahrain | 778 | tiny shape |
| 16 | `dm` | 🇩🇲 Dominica | 750 | tiny shape |
| 17 | `to` | 🇹🇴 Tonga | 747 | |
| 18 | `sg` | 🇸🇬 Singapore | 734 | tiny shape |
| 19 | `fm` | 🇫🇲 Micronesia | 702 | |
| 20 | `lc` | 🇱🇨 Saint Lucia | 616 | tiny shape |
| 21 | `pw` | 🇵🇼 Palau | 459 | tiny shape |
| 22 | `sc` | 🇸🇨 Seychelles | 452 | tiny shape |
| 23 | `ag` | 🇦🇬 Antigua and Barbuda | 442 | tiny shape |
| 24 | `bb` | 🇧🇧 Barbados | 430 | tiny shape |
| 25 | `vc` | 🇻🇨 Saint Vincent and the Grenadines | 389 | tiny shape |
| 26 | `gd` | 🇬🇩 Grenada | 344 | tiny shape |
| 27 | `mt` | 🇲🇹 Malta | 316 | tiny shape |
| 28 | `mv` | 🇲🇻 Maldives | 300 | tiny shape |
| 29 | `kn` | 🇰🇳 Saint Kitts and Nevis | 261 | tiny shape |
| 30 | `mh` | 🇲🇭 Marshall Islands | 181 | tiny shape |
| 31 | `li` | 🇱🇮 Liechtenstein | 160 | tiny shape |
| 32 | `sm` | 🇸🇲 San Marino | 61 | tiny shape |
| 33 | `tv` | 🇹🇻 Tuvalu | 26 | **no shape in world.json — needs a dot marker** |
| 34 | `nr` | 🇳🇷 Nauru | 21 | tiny shape |
| 35 | `mc` | 🇲🇨 Monaco | 2 | tiny shape |

Once the countries are done, the big remaining content job is real
recordings for the English-only countries in the other nine sound languages.
