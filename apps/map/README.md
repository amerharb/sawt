[![Version](https://img.shields.io/badge/version-0.27.0-blue.svg)](https://github.com/amerharb/sawt)
# Map

Small React project to find countries on the world map and hear their names in
the selected language. Sister project of [Flag](../flag) — the same countries
and the same recordings, taught by *where* instead of by flag.
Also sister of [Color](../color), [Week](../week), [Number](../number),
[Anthem](../anthem) and [Face](../face).

## The map

The whole area below the app bar is one world map. Countries the app teaches
are filled in and clickable; the rest of the world is drawn in grey and inert.

- **Hover** a country to see its flag and name in the interface language
- **Click** it to hear its name in the selected sound language (the display at
  the top shows the flag and what was said)
- Vatican City, Andorra, Gibraltar and every micro-state are too small to
  draw at world scale — they appear as small dots at their true locations,
  clickable like any other country. In tight clusters (the Lesser Antilles
  chain) the dots shrink so each keeps its own clickable centre

The geometry lives in `public/world.json` (~260 kB, ~91 kB gzipped): the
Natural Earth 50m world atlas (public domain, via the `world-atlas` package),
projected with d3-geo's Natural Earth projection, simplified, Antarctica
omitted. One boundary departs from what Natural Earth ships: Morocco and
Western Sahara are divided by the straight 27°40′N parallel — the old Spanish
Sahara line, and the one the UN still uses — rather than by the Moroccan Wall,
so Western Sahara is drawn as the whole territory instead of only the Free
Zone east of the berm. Regenerating it is a build-time job — d3 and topojson are not
dependencies of this project. Replacing it in place needs a `cacheVersion`
raise in `src/audioCache.ts`, exactly like a re-recorded sound.

## Countries supported

Eight island countries are **beta** here and hidden from production, though
they stay live in Flag: Kiribati, Micronesia, Tonga, São Tomé and Príncipe,
Cape Verde, Comoros, Samoa and Mauritius. Each is drawn as separate islands
too small to see or click at world scale, and too far apart for the single
dot that works for a compact micro-state. Their land still draws, grey and
inert.

Otherwise the same as [Flag](../flag), minus the entries with no shape of
their own to click: the map's United Kingdom is a single shape, so Scotland, Wales,
England and Northern Ireland (`gb-sct`, `gb-wls`, `gb-eng`, `gb-nir`) stay
Flag exclusives, as does the European Union (`eu`) — it has no borders of its
own, only its 27 members'.

Countries recorded in only some languages (a hundred and fifty-eight speak
English, German and Swedish only so far: Afghanistan, Algeria, Angola, Antigua and Barbuda, Argentina, Armenia,
Australia, Azerbaijan, the Bahamas, Bahrain, Bangladesh, Barbados, Belarus, Belize, Benin,
Bhutan, Bolivia, Botswana, Brazil, Brunei, Burkina Faso, Burundi, Cambodia, Cameroon,
Cape Verde, the Central African Republic, Chad, Chile, China, Colombia, the Comoros, both Congos,
Costa Rica, Cuba, Cyprus, Djibouti, Dominica, the Dominican Republic, East Timor,
Ecuador,
El Salvador, Equatorial Guinea, Eritrea, Estonia, Eswatini, Ethiopia, Fiji,
Finland, Gabon, the Gambia, Georgia, Ghana, Greenland, Grenada, Guatemala, Guinea,
Guinea-Bissau, Guyana, Haiti, Honduras, Hong Kong, India, Indonesia, Ireland, Ivory
Coast, Jamaica, Jordan, Kazakhstan, Kenya, Kiribati, both Koreas, Kosovo, Kuwait,
Kyrgyzstan, Laos, Latvia, Lesotho,
Liberia, Libya, Liechtenstein, Lithuania, Macau, Madagascar, Malawi, Malaysia, the Maldives, Mali, Malta, the Marshall Islands,
Mauritania,
Mauritius, Mexico, Micronesia, Moldova, Monaco, Mongolia, Montenegro, Mozambique, Myanmar, Namibia, Nauru, Nepal,
New Zealand, Nicaragua, Niger, Nigeria, North Macedonia, Northern Cyprus, Pakistan, Palau, Panama,
Papua New Guinea, Paraguay, Peru, the Philippines, Qatar, Romania, Russia,
Rwanda, Saint Kitts and Nevis, Saint Lucia, Saint Vincent and the
Grenadines, Samoa, San Marino, São Tomé and Príncipe, Saudi Arabia, Senegal, the Seychelles, Sierra Leone, Singapore, Slovenia, the Solomon Islands,
Somalia, South Africa, South Sudan, Sri Lanka, Sudan, Suriname, Taiwan,
Tajikistan, Tanzania, Togo, Tonga, Trinidad and Tobago, Turkmenistan, Tuvalu, Uganda, Uruguay, Uzbekistan,
Vanuatu, Venezuela, Vietnam, Western Sahara, Yemen, Zambia and Zimbabwe) go
grey when another hearing language is selected — the same grey as untaught countries — instead of clicking silently.
Each country file's `sounds` field says which recordings exist; absent means
all ten.

## Spoken languages
- Albanian (Shqip)
- Arabic (عربي)
- Danish (Dansk)
- English
- German (Deutsch)
- Persian (فارسی)
- Portuguese (Português)
- Swedish (Svenska)
- Turkish (Türkçe)
- Ukrainian (Українська)

## Interface languages
- English
- Arabic (عربي)
- German (Deutsch)
- Greek (Ελληνικά)
- Swedish (Svenska)
- Thai (ไทย)
- Turkish (Türkçe)
- Simplified Chinese (简体中文)

Hover names follow the interface language. Every country's `name` record
carries all thirteen names — the ten sound languages plus Greek, Thai and
Chinese, which are interface-only: names to read, with no recording behind
them.

## How it works
Pick the sound language from the dropdown in the top right, then click a
country to hear its name. There is no sorting and no shuffling anywhere in
this app — the countries sit where geography put them.

### URL parameters
For a shareable deep link. Every value is checked against what the app
actually has, and a parameter with nothing usable left in it is **ignored**
rather than applied.

- `i` — items: which countries are clickable, e.g. `?i=se,sy` (the rest turn
  grey)
- `s` — sounds: which languages are shown, first one selected, e.g. `?s=ar,en`
- `l` — interface language, e.g. `?l=ar`
- `t` — theme: `system`, `light` or `dark`

**🔗 in the settings panel copies a link to what you are looking at now.**

- App bar, right to left: the toolbar (🕹️ game, 🔊 mute, language, ⚙️), then
  in a round the round actions, the display and the score. The actions sit
  beside the toolbar so the two things pressed during a round are together.
  Narrow screens stack the bar instead — toolbar, display, score, actions —
  putting the actions nearest the map.
- Short screens (a phone in landscape) scroll. The map is never squeezed below
  the height that shows the whole world at full width, so when the stacked bar
  leaves less than that the page grows and scrolls, and the bar scrolls away
  with it rather than staying pinned over half a short screen. Everywhere with
  room to spare, the map still fills the space under the bar exactly as before.
- Mute (🔊/🔇), settings (⚙️: theme, interface language, language checklist,
  country checklist, flight mode, cache, share link) — as in every sister app.
  The country checklist lists every country by flag and name in the interface
  language, sorted by that language's own collation, so it re-sorts when the
  interface language changes.
- Flight mode (✈️) downloads all visible sounds **and the map itself**, so the
  app works offline end to end.
- Game (🕹️): a country's name is spoken and shown with its flag — find it on
  the map.
  👍 correct; a wrong click marks that country red until the round's target is
  found; 🤷‍♂️ reveals the answer, colored amber. No shuffling: the challenge is
  where, not what.
- Near-miss forgiveness: aiming a finger at a small country easily lands on a
  neighbour or in the sea. A wrong click close to the target is not counted —
  the map zooms in ×2 around the click (never around the target, so nothing
  is given away) and you try again; a second near miss zooms once more, to
  ×4. After that misses count normally, and finding the target glides the
  view back to the whole world (the zoom animates in both directions, unless
  the device asks for reduced motion). The three knobs live in `src/App.tsx`:
  `MISS_FORGIVENESS` (how close counts as near, 30 map units at ×1, scaled
  with the zoom), `MISS_ZOOM` (×2) and `MISS_ZOOM_LIMIT` (2 zooms per
  prompt).

### Map colors

| state | meaning |
| --- | --- |
| grey | not taught here (or hidden in settings) |
| steel blue | clickable |
| deep blue | the country whose name is showing (learn mode) |
| green | found (game) |
| amber | given up (game) |
| red | guessed wrong — clears when the target is found |

## How to contribute
### Media files
Audio lives under `public/sound/` as AAC: `lang/<language>/<code>.aac` — the
country's name spoken in that language — plus the shared game `fx/` sounds.
Recordings are shared with [Flag](../flag); a new language or country lands in
both apps.

### Coding
Map is an open source project built on Vite, React 19, TypeScript v6.x and
npm. All the code is Frontend, no backend needed.

To add a country:
1. Create `src/countries/<code>.ts` exporting a `Country` (`code`, `name` in
   every spoken language plus the el/th/zh display names, `flag`).
2. Import it and add it to the `ALL_COUNTRIES` array in `src/App.tsx`.
3. Record its name at `public/sound/lang/<language>/<code>.aac` for every
   spoken language.
4. Check it has a shape in `public/world.json` (ISO code, lowercase). A
   country too small to draw goes into the `MARKERS` table in
   `src/WorldMap.tsx` instead.

#### Setup environment
- Node 20.19 or above
- npm 9.x or above
- Install `npm install`
- Build: `npm run build` (output in `dist/`)
- Start dev server: `npm start`
- Preview production build: `npm run preview`

### Deploying
Once a PR is merged to the main branch it is automatically deployed using the
Vercel integration tool with GitHub.
