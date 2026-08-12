# TODO — countries left for Flag and Map

The campaign: every country in both [Flag](apps/flag) and [Map](apps/map),
English recording only to start (`sounds: ['en']` — see each app's README for
how partial coverage behaves). 180 are in so far (see the changelog); only
the micro-states remain, in area order.

Every entry below already has its flag glyph in `flags.woff2`, so Flag-side
they are routine. The work is on the Map side: each has either a "tiny shape"
(world.json geometry that is a speck at world scale) or, for Tuvalu, no shape
at all. Adding them means deciding by eye which get promoted to dot markers —
the `MARKERS` table in `src/WorldMap.tsx`, the way Vatican City, Andorra and
Gibraltar are drawn — rather than relying on an unfindable speck.

| # | code | country | area km² | note |
| --- | --- | --- | --- | --- |
| 1 | `bh` | 🇧🇭 Bahrain | 778 | tiny shape |
| 2 | `dm` | 🇩🇲 Dominica | 750 | tiny shape |
| 3 | `sg` | 🇸🇬 Singapore | 734 | tiny shape |
| 4 | `lc` | 🇱🇨 Saint Lucia | 616 | tiny shape |
| 5 | `pw` | 🇵🇼 Palau | 459 | tiny shape |
| 6 | `sc` | 🇸🇨 Seychelles | 452 | tiny shape |
| 7 | `ag` | 🇦🇬 Antigua and Barbuda | 442 | tiny shape |
| 8 | `bb` | 🇧🇧 Barbados | 430 | tiny shape |
| 9 | `vc` | 🇻🇨 Saint Vincent and the Grenadines | 389 | tiny shape |
| 10 | `gd` | 🇬🇩 Grenada | 344 | tiny shape |
| 11 | `mt` | 🇲🇹 Malta | 316 | tiny shape |
| 12 | `mv` | 🇲🇻 Maldives | 300 | tiny shape |
| 13 | `kn` | 🇰🇳 Saint Kitts and Nevis | 261 | tiny shape |
| 14 | `mh` | 🇲🇭 Marshall Islands | 181 | tiny shape |
| 15 | `li` | 🇱🇮 Liechtenstein | 160 | tiny shape |
| 16 | `sm` | 🇸🇲 San Marino | 61 | tiny shape |
| 17 | `tv` | 🇹🇻 Tuvalu | 26 | **no shape in world.json — needs a dot marker** |
| 18 | `nr` | 🇳🇷 Nauru | 21 | tiny shape |
| 19 | `mc` | 🇲🇨 Monaco | 2 | tiny shape |

Once the countries are done, the big remaining content job is real
recordings for the English-only countries in the other nine sound languages.
