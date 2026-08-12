# TODO — countries left for Flag and Map

The campaign: every country in both [Flag](apps/flag) and [Map](apps/map),
added in batches of ten, biggest by area first, English recording only to
start (`sounds: ['en']` — see each app's README for how partial coverage
behaves). 170 are in so far (see the changelog); these remain, in area order.

Every entry below already has its flag glyph in `flags.woff2`. "tiny shape"
means the world.json geometry exists but is a speck at world scale — when a
batch reaches those, decide by eye which get promoted to dot markers, the way
Vatican City, Andorra and Gibraltar are drawn in Map.

| # | code | country | area km² | note |
| --- | --- | --- | --- | --- |
| 1 | `bn` | 🇧🇳 Brunei | 5,765 | |
| 2 | `tt` | 🇹🇹 Trinidad and Tobago | 5,130 | |
| 3 | `cv` | 🇨🇻 Cape Verde | 4,033 | |
| 4 | `ws` | 🇼🇸 Samoa | 2,842 | |
| 5 | `km` | 🇰🇲 Comoros | 2,235 | |
| 6 | `mu` | 🇲🇺 Mauritius | 2,040 | |
| 7 | `st` | 🇸🇹 São Tomé and Príncipe | 964 | |
| 8 | `ki` | 🇰🇮 Kiribati | 811 | shape straddles the dateline |
| 9 | `bh` | 🇧🇭 Bahrain | 778 | tiny shape |
| 10 | `dm` | 🇩🇲 Dominica | 750 | tiny shape |
| 11 | `to` | 🇹🇴 Tonga | 747 | |
| 12 | `sg` | 🇸🇬 Singapore | 734 | tiny shape |
| 13 | `fm` | 🇫🇲 Micronesia | 702 | |
| 14 | `lc` | 🇱🇨 Saint Lucia | 616 | tiny shape |
| 15 | `pw` | 🇵🇼 Palau | 459 | tiny shape |
| 16 | `sc` | 🇸🇨 Seychelles | 452 | tiny shape |
| 17 | `ag` | 🇦🇬 Antigua and Barbuda | 442 | tiny shape |
| 18 | `bb` | 🇧🇧 Barbados | 430 | tiny shape |
| 19 | `vc` | 🇻🇨 Saint Vincent and the Grenadines | 389 | tiny shape |
| 20 | `gd` | 🇬🇩 Grenada | 344 | tiny shape |
| 21 | `mt` | 🇲🇹 Malta | 316 | tiny shape |
| 22 | `mv` | 🇲🇻 Maldives | 300 | tiny shape |
| 23 | `kn` | 🇰🇳 Saint Kitts and Nevis | 261 | tiny shape |
| 24 | `mh` | 🇲🇭 Marshall Islands | 181 | tiny shape |
| 25 | `li` | 🇱🇮 Liechtenstein | 160 | tiny shape |
| 26 | `sm` | 🇸🇲 San Marino | 61 | tiny shape |
| 27 | `tv` | 🇹🇻 Tuvalu | 26 | **no shape in world.json — needs a dot marker** |
| 28 | `nr` | 🇳🇷 Nauru | 21 | tiny shape |
| 29 | `mc` | 🇲🇨 Monaco | 2 | tiny shape |

Once the countries are done, the big remaining content job is real
recordings for the English-only countries in the other nine sound languages.
