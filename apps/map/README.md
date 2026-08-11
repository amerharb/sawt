[![Version](https://img.shields.io/badge/version-0.24.0-blue.svg)](https://github.com/amerharb/sawt)
# Map

Small React project to find countries on the world map and hear their names in
the selected language. Sister project of [Flag](../flag) — the same countries
and the same recordings, taught by *where* instead of by flag.
Also sister of [Color](../color), [Week](../week), [Number](../number),
[Anthem](../anthem) and [Face](../face).

## The map

The whole area below the app bar is one world map. Countries the app teaches
are filled in and clickable; the rest of the world is drawn in grey and inert.

- **Hover** a country to see its name in the interface language
- **Click** it to hear its name in the selected sound language (and see what
  was said in the display)
- Vatican City, Andorra and Gibraltar are too small to draw at world scale —
  they appear as small dots at their true locations, clickable like any other
  country

The geometry lives in `public/world.json` (~260 kB, ~91 kB gzipped): the
Natural Earth 50m world atlas (public domain, via the `world-atlas` package),
projected with d3-geo's Natural Earth projection, simplified, Antarctica
omitted. Regenerating it is a build-time job — d3 and topojson are not
dependencies of this project. Replacing it in place needs a `cacheVersion`
raise in `src/audioCache.ts`, exactly like a re-recorded sound.

## Countries supported

The same 44 as [Flag](../flag), except Scotland: the map's United Kingdom is a
single shape, so `gb-sct` has no geometry of its own to click and stays a Flag
exclusive.

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

Hover names follow the interface language. Three of these (Greek, Thai,
Chinese) are not sound languages, so each country carries a `label` record
with just those names alongside its spoken `name` record.

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

- Mute (🔊/🔇), settings (⚙️: theme, interface language, language checklist,
  country grid, flight mode, cache, share link) — as in every sister app.
- Flight mode (✈️) downloads all visible sounds **and the map itself**, so the
  app works offline end to end.
- Game (🕹️): a country's name is spoken and shown — find it on the map.
  👍 correct; a wrong click marks that country red until the round's target is
  found; 🤷‍♂️ reveals the answer, colored amber. No shuffling: the challenge is
  where, not what.

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
   every spoken language, `label` for el/th/zh, `flag`).
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
