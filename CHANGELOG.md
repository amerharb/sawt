# Sawt Changelog

<!-- https://keepachangelog.com/en/1.0.0/ -->

One version covers the whole repository: the workspace and every app in
`apps/` share a version number and this changelog.

Each app also keeps its own `CHANGELOG.md`, covering the years it spent as a
separate repository up to 0.17.0. Those files are frozen — everything from
0.18.0 onwards is recorded here.

## [0.32.0] (unreleased)
<!--
Deployment pendings, if still open by release time:
  · flag / color / number Vercel projects need Root Directory, install command
    and domains updated by hand; the old plural domains attached so the 308s fire
  · Face's home tile is still beta-gated — face.sawt.info answers, so it is a
    one-word change in apps/home/src/apps.ts whenever wanted
  · Verb needs its Vercel project created: sawt-verb, Root Directory apps/verb,
    install command `npm ci --include-workspace-root --workspace=verb`, domain
    verb.sawt.info — its home tile stays beta-gated until that answers

In this version so far:
  · Room codes are six digits now, not four animals: 004271. The animal keypad
    was lovely and it cost more than it looked — a client had to fetch the
    server's list before it could draw a code at all, and every new avatar had
    to be checked against that list so an animal on screen meant either a room
    or a player. A digit needs no list. 🏟️'s join screen is a number view: tap
    it on the keypad (1–9 with 0 under the 8, the layout every child has
    watched an adult use), type it on a keyboard, or let a phone raise its own
    number pad — the field is inputMode="numeric" and focused when the screen
    opens, so all three work without anyone choosing between them. The
    Arabic-Indic digits count as the same code (٠٠٤٢٧١), so it can be typed on
    the keyboard a child actually has. Six digits rather than four because the
    code is the only thing between a stranger and a lobby full of children:
    one blind guess in two thousand against one in twenty. And the leading
    zeros are part of the code — ?room=4271 is not the same room as 004271, it
    is not a room at all, which is why nothing on either side of the wire ever
    treats a code as a number. In all seven apps that have a courtyard —
    anthem, color, face, flag, number, verb, week — since the panel is shared
    and only each app's own copy of the keypad styling and its nine or ten
    dictionaries had to follow. Needs saha ≥ 0.4.0
  · The join screen is field, keypad, one line of status — in that order and
    never otherwise. The keypad used to vanish with the sixth digit and the
    message used to move from above the field to below it, which meant the
    screen jumped under a child's finger at the exact moment they were being
    told they had got the number wrong. Now the pad stays put (greyed while
    the code is full, so a tap that would do nothing looks like it), and the
    line at the bottom holds its height whether it is showing the prompt, the
    reason six digits are not a room, or nothing at all because the room was
    found and the animals below are what to look at next
  · And that "needs saha ≥ 0.4.0" is enforced now rather than just written
    down. The health gate reads the version /health reports and refuses a
    server older than the one this build depends on, so a deploy that goes out
    in the wrong order leaves 🏟️ simply absent — the same thing the app already
    does when saha is down — instead of a join keypad drawn from a palette that
    no longer comes and a code every room refuses. It catches the other
    direction too, an old page against a new server, which is why the check
    lives here rather than in a /v2 in the URL: one number in one place, and
    saha's paths stay a namespace rather than a promise (its README now says
    why). The comparison is numeric field by field, because as text 0.10.0
    sorts below 0.4.0 and a lexical compare would refuse a server six releases
    too new

Content ledger:
  · Flag and Map — 207/202 entries (Flag also has the UK's four countries
    and the EU), every one speaking English, German, Swedish and Arabic;
    six languages remain (da sq pt tr fa uk, ~1,000 recordings — see TODO.md)
  · Anthem — 9 countries still beta: ir nl no pl ps pt tn ua va (ir is a
    confirmed dead end). A score is not required to leave beta (al and iq
    are live without one); Italy is live with lyrics but still scoreless
  · Anthem — 🎤 and 👥 stay beta types until more than four countries have a
    sung recording (ch cz gb us today); the PD 1943 Italian choir recording
    is converted and waiting in this session's scratchpad history — wiring it
    would make five
  · Groupings — @sawt/world carries six continents (a partition of every
    code) and 19 regions (a lens: overlaps and gaps on purpose, six members
    minimum). The ➕/➖ menu renders one section per family, so a third
    family (EU, Arab League, Eurovision…) is a data-only change
  · Week — Thai and Chinese day names written but unrecorded; 8 spoken languages
  · Color — 6 spoken languages (ar de en he sv uk) against Number's 12
  · Face — 9 faces; the custom face font (the flags.woff2 approach) still to be
    drawn so every platform sees the same faces
  · Verb — seven verbs in four moment scenes each; the roadmap is more verbs
    (run, dance, sleep, cry…), the other six spoken languages, and one day
    the tense-discrimination game (hear كُلْ؟ أكل؟ يأكل؟ — tap the matching
    scene)
  · Multiplayer — 🏟️ is wired in seven apps (color flag week number face
    anthem verb); Map is the one without it, and would need an answer to what
    "the same board" means before it could have one. saha (saha.sawt.info,
    Rust/Axum on Fly.io, its own repo ~/code/amerharb/saha) must run on
    exactly one machine: rooms live in one process's memory. The client speaks
    saha 0.3.0 today — the deployed server and the room-held-to-one-sound
    line both need it — and 0.4.0 is what this version is meant to build
    against; that repo's own CHANGELOG is where its unreleased section lives
  · Game data — rounds and language pings both flow to sada (sada.sawt.info,
    Rust/Axum on Fly.io + Neon Postgres, its own repo ~/code/amerharb/sada):
    POST /v1/rounds and POST /v1/settings are wired from every game app. The
    stats endpoints are read by sada's own dashboard (that repo's web/, on
    the same domain behind STATS_TOKEN) — nothing reads them from sawt

Worth knowing before touching these:
  · sada's client (packages/game/src/sada.ts) probes GET /health — not
    /healthz — at most once per 10 minutes, and the committed per-app .env
    files are the on/off switch and carry its URL — sada.sawt.info, the
    canonical domain (a CNAME to the Fly app); moving it means editing
    those eight files
  · saha's client works the same way (VITE_SAHA_ENABLED + VITE_SAHA_URL,
    health-gated, silent when down — 🏟️ simply does not appear), and adds one
    rule of its own: a room's four animals map to letters *by palette
    position*, and that alphabet skips I and O. Never map by character code —
    that bug has now been written twice, which is what
    packages/game/src/saha.test.ts guards against
  · a courtyard round posts to sada like any other, labelled `race:<language>`
    so it can be told apart from a child playing alone. Its board is the dealt
    board, which is what keeps sada's board-length rule satisfied
  · a saha id — the sound a room can be held to — is lowercase letters, digits
    and hyphens, nothing else. Anthem's renderings travel kebab-cased
    (`introInstrument` → `intro-instrument`) and Verb sends a *pair*
    (`en-did`); both are read back through the app's own list, so an id no
    build knows names nothing. An id the server refuses fails the whole join,
    not just the lock
  · a wrong tap locks the *player* for two seconds on the server, while the
    client greys only the card that was tapped. A correct tap inside that
    window is discarded in silence — worth remembering when a race looks
    broken under test
  · a test that touches browser globals must declare
    `// @vitest-environment jsdom`. Node 26 ships sessionStorage and CI's
    Node 24 does not, so the node environment passes locally and fails there;
    `NODE_OPTIONS=--no-experimental-webstorage` reproduces CI
  · flags.woff2 lives in the visual-design repo and is copied into flag, map
    and anthem — run its tools/sync-flags-font.py rather than copying by hand;
    the builder is not byte-reproducible, so a stray rebuild shows as a diff
  · world.json is hand-edited in a handful of places (the widened frame,
    Tuvalu and Gibraltar hand-placed, the xk/xc codes, the Morocco/Western
    Sahara parallel) — its own `note` field lists them, including the fitted
    projection (scale 185.249, translate 500.005/255.171) that placed the
    last two — and 121 shapes carry a generated `h`
    (tools/gen_hit_shape.py --all --write regenerates the lot). Any in-place
    change needs one cacheVersion raise per version, not per edit
  · Map's <svg> takes its size from its container, never from its viewBox:
    the frame is stretched to the map area's ratio (WorldMap's `stretched`)
    and the element fills that box by inset. Safari resolves a percentage
    height against a flex-sized parent as `auto` and then sizes a viewBox'd
    <svg> from its intrinsic ratio — a tall frame grew the map to 1280×2233
    inside a 727-tall clipped box. Keep those two ratios equal
  · Map's marker dots paint over the map, so a dot's hit radius can swallow a
    small neighbour — that is what made Qatar and Switzerland unclickable.
    Re-run the coverage audit after adding one. A dot is additive now: the
    country's land is always drawn and always clickable, which is what makes
    MARKER_PX safe to raise (12 today, 3 before) — and what let the last
    per-country table go. WorldMap.tsx names no country at all now; every
    dot sits where its geometry says
  · Verb animations: a new verb's SVG should star the same kid (hair #5C4013,
    skin #F2C094, red shirt #E05A4E) and include the prefers-reduced-motion
    stop; edits to an existing anim/<code>.<scene>.svg need a cacheVersion
    raise in apps/verb/src/audioCache.ts, exactly like a re-recorded sound
  · ESLint warnings are capped at 24 in CI (the known set-state-in-effect
    debt) — fixing some means lowering the cap in .github/workflows/ci.yml
    so they cannot creep back

Dead ends already checked, so nobody spends the time again:
  · Iran's only MIDI is the anthem it replaced in 1990 (World Atlas 1991 trap,
    verified by fit: 0.6351 at +0/0s vs 0.5059 needing +10/16.2s); the only
    notation is a GIF at 2.5px per diatonic step. ir and iq both need notation
    that does not currently exist anywhere
  · Noto Animated Emoji has no people performing actions (checked all 881
    entries): no swimmer, no eater, no runner — only faces, hands, food and
    animals. Verb animations have to be drawn here
  · Italy's brass-arrangement MIDI (BitMidi 79440): the only melodic sources
    are a trumpet that hands the verse to the horns mid-hold — the splice
    plays but did not survive the ear test. Italy's score needs a cleaner
    monophonic source, not another go at this file
-->

## [0.31.0] 2026-08-31

The apps learned to play with each other. A **courtyard** — 🏟️, inside game
mode — is a room on saha, the third repo in the family: a small Rust service
that holds a board in memory for a few minutes and then forgets it. Two
children (or twelve) get one board, one target at a time, and the first
correct tap wins the card. The wire carries only item codes, so each child
hears that target in their *own* selected language, from sounds their own
device cached before the round began — which is the whole reason a child
learning Arabic and a child learning Swedish can race the same round. A host
who would rather everyone hunted in one language can hold the room to theirs,
and then the game is not "find the red one" in the language you know but in
the one you are being taught. A room is four animals tapped from a keypad:
no keyboard, no letters, and nothing one child can type at another.

Seven of the eight game apps have it — Color first, then Flag, then Week,
Number, Face, Anthem and Verb. Only Map stays out, where "the same board"
would mean the same world and a race is a different design question. Needs
saha ≥ 0.3.0.

### Added
- **The courtyard (🏟️), inside game mode.** 🕹️ first, then 🏟️ at the head of
  the round buttons — a courtyard is a way of playing rather than a setting.
  One child opens a room and gets **four animals** (🐘🦆🦋🦌); the others tap
  those four on a keypad, or follow a `?room=` link that lands on the keypad
  already filled. Everyone picks an animal to be, chosen by *index* from a
  palette the server owns, so no name and no free text ever crosses between
  children. The host presses ▶️; the first correct tap takes the card; a wrong
  tap greys it for that child for two seconds; 🤷‍♂️ is a **vote**, and a target
  is revealed only when most of the room agrees. Most cards takes 🏆, a tie is
  shared, and a tablet that falls asleep keeps its place and its score for a
  minute and walks straight back in. The shared pieces live in `@sawt/game`
  (`saha.ts`, `useRace.ts`, `RaceHud.tsx`) and are health-gated on
  `VITE_SAHA_ENABLED` + `VITE_SAHA_URL`: with no courtyard configured, or one
  that does not answer, 🏟️ is simply not there and every app is exactly the
  single-player app it has always been.
- **A won card wears its winner.** 👍 in one top corner and the winner's animal
  in the other, so a finished board reads as a record of the race — who took
  which colour, flag, day or face — rather than a row of ticks. saha's
  snapshot carries `{code, by}` per settled card, so a child who reloads
  mid-race rebuilds the marks too (verified by reloading one of two live tabs
  and diffing the board card for card). A card the room gave up on wears 🤷‍♂️
  and nobody's animal.
- **A host can hold the room to one sound.** Each child hearing their own stays
  the default and stays the point — but it also means the language is the one
  thing the race is never about, and sometimes that is the whole game. 🏟️'s
  panel says which it is (🔓 everyone hears their own / 🔒 everyone hears:
  Arabic) and so does the join screen, from the room probe, so a child taps
  four animals and is told what they are walking into while backing out is
  still free. While a room is held, the sound *and* the word on the display
  follow it — a race heard in Arabic whose display read "Blå" would hand every
  answer to whoever can read. Nobody's own settings are touched: leave the
  room and the app is the one they chose again.
- **Seven apps, one courtyard — and three of them taught the hook something.**
  Flag brought the **round length**: `useRace` gained `roundSize`, read once
  when a room opens, so a rematch keeps the number and the ⚙️ buttons for it
  rest while you are in one (Anthem's rooms take it too). Anthem brought a
  prompt that is **not a url**: `urlsOf`, the same escape hatch `useGame`
  already had, so a rendering that is a *window* into a recording shared with
  other renderings — or 🎼 a written melody with no audio file at all — can be
  dealt like anything else; a room held to 🎼 Notes downloads nothing and
  synthesizes on every screen. Verb brought a sound that is a **pair**: a
  language and a moment, travelling as `en-did`, where a held room moves the
  pictures as well as the words, because ⌛ done is a different game from ❗
  do! and a child hearing "has eaten" over an anticipation animation would be
  somewhere else entirely. saha's ids are lowercase letters, digits and
  hyphens, so Anthem's `introInstrument` travels as `intro-instrument`; every
  id is read back through the app's own list, and one no build recognises
  names nothing rather than putting a stranger's word on a child's screen.
- **Each board keeps its own sense in a room.** Week stays in week order and
  Number in counting order — those two boards mean something in their own
  order — while the shuffled apps draw the board as the server dealt it. Every
  room's board is dealt from the intersection of what each child can actually
  hear, so nobody is ever asked for a sound they do not have. Checked against
  the live courtyard app by app, two tabs each: rooms opened by keypad and by
  `?room=` link, the first correct tap winning the card on both screens with
  the winner's animal on it, 🤷‍♂️ votes revealing one nobody could find, and a
  guest set to one language reading and hearing the room's other — Arabic →
  English in Flag, Week and Face, Persian → Swedish in Number, Arabic ❗ →
  English ⏪ in Verb (which fetched the English `did` files, not its own), and
  🎺 → 🥁🎺 and 🎼 in Anthem.

### Changed
- **Every README caught up** with what 0.30 shipped and what this version
  adds: 🏁 the round length in Flag, Anthem and Map, the ➕/➖ continent and
  region menus, and 🏟️ with its `?room=` parameter in all seven apps that have
  one. Map's page also gained 🔍 zoom to fit and the 🎴 dealt round, and lost a
  paragraph that still described near-miss forgiveness as two tries per prompt
  — it has been a zoom ceiling since 0.30.0.

### Fixed
- **A solo give-up no longer follows a child into a courtyard.** Nothing
  clears a round's 🤷‍♂️ until the next one starts, so giving up on Iraq alone
  and then opening a room left Iraq greyed out — and unwinnable when the room
  asked for it. Colour had it too; every app is guarded now, and a courtyard's
  given-up cards arrive with the board instead.
- **A test now says which environment it needs.** `saha.test.ts` reaches for
  `sessionStorage` and carried no `@vitest-environment` docblock, so it ran in
  Vitest's node environment and passed only because Node 26 ships Web Storage
  as a global. CI pins Node 24, which does not, and the suite went red there
  while staying green on every machine. It declares `jsdom` now, like the two
  React test files beside it. `NODE_OPTIONS=--no-experimental-webstorage`
  reproduces the CI runtime locally.

Deployment notes, carried and still pending: the flag / color / number Vercel
projects need Root Directory, install command and domains updated by hand.
Face's home tile stays beta until flipped — face.sawt.info answers. Verb needs
its Vercel project created: sawt-verb, Root Directory `apps/verb`, install
command `npm ci --include-workspace-root --workspace=verb`, domain
verb.sawt.info — its home tile stays beta-gated until that answers. New this
time: the seven apps with 🏟️ carry `VITE_SAHA_ENABLED` and `VITE_SAHA_URL` in
their committed `.env`, so nothing has to be set in Vercel — but the
courtyard only appears while saha.sawt.info answers, and the held-sound line
needs saha ≥ 0.3.0. Nothing in world.json changed, so the map's cacheVersion
stays at 6.

## [0.30.2] 2026-08-30

One browser, one shape. Zoom to fit can build a frame taller than it is wide
— Algeria and Angola make one — and Safari sized the map from that frame's
ratio instead of from the box it sits in, growing it past its clipped
container until only the north of Algeria was left on screen. Every frame is
now stretched to the shape of the map area before it is shown, so the two
ratios can never disagree.

### Fixed
- **Safari showed only the north of Algeria.** Select two countries far apart
  north to south — Algeria and Angola — and zoom to fit builds a tall frame
  (119 × 209 map units). `.map-area` is a flex item, and Safari resolves a
  percentage height against such a parent as `auto`; an `<svg>` with a
  viewBox and an auto height then takes its size from its *intrinsic* ratio,
  which is the viewBox's. So the map became 1280 × 2233 inside a 727-tall
  box with `overflow: hidden` — clipped to its top strip, which held nothing
  but northern Algeria. Reproduced exactly by forcing that sizing in
  Chrome. Two changes remove it: the map now fills its container by inset
  rather than by percentage, and — the part that actually makes it
  impossible — every frame is stretched to the map area's own shape before
  it is shown, so the viewBox's ratio always equals the box it is drawn in
  and the intrinsic ratio has nothing left to disagree about. The browser
  was already showing that stretched area (preserveAspectRatio letterboxes
  a frame that does not match), so nothing moves on screen; it is now
  explicit rather than left to the renderer. The whole-world view goes
  through the same stretch, which closes the same trap on a window wider
  than the map.

Deployment notes, carried and still pending: the flag / color / number Vercel
projects need Root Directory, install command and domains updated by hand.
Face's home tile stays beta until flipped — face.sawt.info answers. Verb needs
its Vercel project created: sawt-verb, Root Directory `apps/verb`, install
command `npm ci --include-workspace-root --workspace=verb`, domain
verb.sawt.info — its home tile stays beta-gated until that answers. Nothing
in world.json changed this time, so the map's cacheVersion stays at 6.

## [0.30.1] 2026-08-30

Zoom to fit, shipped a day earlier, framed a shade too tightly: it built the
view from each country's main landmass alone, so Alaska and Hawaii fell
outside a frame around the United States and Svalbard and the Canaries
outside one around Europe. The frame now reaches for outlying land that sits
near it. While the map's placement code was open, its last country-specific
table went with it — Gibraltar into the atlas where it belongs, Macao and
Hong Kong needing nothing at all.

### Changed
- **Gibraltar moved from the code into the atlas.** It was the one country
  the map positioned by hand — absent from Natural Earth, so a table in
  WorldMap.tsx held its coordinates. It is now a point in world.json at
  485.9,137, the same degenerate form the atlas already uses for Malta,
  Singapore, San Marino and the Vatican, and the position comes from the
  projection rather than from eyeballing the map: fitting geoNaturalEarth1
  to those point-states (scale 185.249, translate 500.005/255.171, residuals
  under 0.15 units across six of them) puts Gibraltar at 485.88,137.02 —
  about 27 km west of where the hand-placed guess had it, on the Spanish
  shore instead of out in the Strait.

  Macao and Hong Kong left the table too, and this time nothing replaced
  them: their entries only nudged two dots 0.7 apart, and the marker work
  earlier in 0.30.0 had already made that unnecessary — a dot is drawn on
  top of its country's land now rather than instead of it, so both are
  clickable on their own geometry whether or not their markers crowd each
  other. **The map's code now knows no country by name**: every dot sits
  where its geometry says, with no exceptions and no table. world.json
  changed in place, so the map's cacheVersion rose to 6.

### Fixed
- **Zoom to fit cut the corners off what it framed.** It built the frame from
  each country's *largest part only* — the rule that keeps an antimeridian
  fragment from stretching the view across the whole map — which also meant
  Alaska and Hawaii fell outside a frame around the United States (Hawaii
  just under the bottom edge, the "cut from the south"), and Svalbard and
  the Canaries outside one around Europe. The frame now starts from those
  main masses and then absorbs any outlying part within 60 map units of
  itself, repeatedly, so reaching Alaska brings the frame close enough to
  reach Hawaii. That distinguishes a territory from an outlier without a
  list of special cases: the United States frames at ×3.2 with all of it in
  view, Europe keeps Svalbard and the Canaries — while French Guiana,
  Réunion and the Dutch Caribbean stay out, an ocean away, instead of
  shrinking Europe into a corner of its own map. The safeguards hold:
  Kiribati still frames locally at ×13 though its islands span 982 units,
  Russia ignores its wrapped Chukotka fragment, and everything-selected is
  still the plain whole world.

Deployment notes, carried and still pending: the flag / color / number Vercel
projects need Root Directory, install command and domains updated by hand.
Face's home tile stays beta until flipped — face.sawt.info answers. Verb needs
its Vercel project created: sawt-verb, Root Directory `apps/verb`, install
command `npm ci --include-workspace-root --workspace=verb`, domain
verb.sawt.info — its home tile stays beta-gated until that answers. This
release does change world.json (Gibraltar), so the map's cacheVersion rose to
6 and every returning browser refetches the atlas once.

## [0.30.0] 2026-08-30

Rounds got shorter and the world got groups. A round now asks 10, 20 or 50
targets instead of all two hundred — Flag and Anthem deal that many cards,
Map stops after that many countries — and the ⚙️ country list gained ➕/➖
menus that add or remove a whole continent or region in one tap, from a new
shared `@sawt/world`. The Map frames whatever is in play by default, so
picking Europe opens on Europe. sada learned its second endpoint and now
hears every language switch as well as every round. And the map's small
countries stopped being a lottery: a dot is drawn on top of its country
rather than instead of it, dots survive to 12px, and the near-miss
forgiveness stops forgiving once it can no longer zoom in to help.

### Fixed
- **The near-miss forgiveness stops forgiving once it cannot help.** It used
  to count tries — two per prompt, each doubling the zoom — which meant a
  map already zoomed past ×4 (zoom to fit frames a continent at ×5, a pair
  of countries at ×17) forgave two clicks for free: no closer look, and no
  👎 either. Forgiveness is now measured in zoom rather than in tries: each
  near miss multiplies the current zoom by ×2 up to a ceiling of ×3.9, and
  when there is no step left the miss counts as the mistake it is. From the
  whole world that reads ×1 → ×2 → ×3.9 → counts; from a view already
  closer than the ceiling it counts straight away. The two knobs are the
  step and the ceiling, and nothing else.
- **A tiny country stays clickable however far you zoom.** Liechtenstein,
  Andorra and Monaco used to become unclickable *because* the map zoomed
  in: past a certain point their dot gave way to a hairline polygon nobody
  could hit. A country now stays a dot until its own shape is 12px rather
  than 3px, so Andorra keeps its dot — and its generous hit circle — until
  ×20.7 zoom and Liechtenstein until ×25.4, well past the sizes where they
  used to vanish. At world scale that makes 111 of 236 countries dots
  instead of 64: Belgium, Switzerland and Lesotho now read as dots on the
  world view, and dissolve into their real shapes as soon as you zoom.
- **A marker dot is drawn on top of its country, not instead of it** — what
  made raising that threshold safe. The dot used to replace the land, which
  is harmless while the land is sub-pixel, but a country carved out of a
  neighbour is a *hole* in that neighbour's own path, so skipping it let
  the sea show through: Lesotho became a 6.6-unit gap in South Africa with
  a 1.9-unit dot rattling inside it, and San Marino and the Vatican had the
  same waiting inside Italy. Both layers now keep drawing a marker
  country's land and the dot simply sits above it. A second bug went with
  it: a marker country's land was missing from the event layer too, so a
  tap on Lesotho outside its dot used to select South Africa.

### Added
- **The world got continents.** A new shared package, `@sawt/world`,
  classifies every country into one of six continents — Africa, Asia,
  Europe, North America, South America and Oceania (Australia the country
  lives inside Oceania with New Zealand and the Pacific islands; Antarctica
  was never on the map). Transcontinental calls are made once, in one file:
  every transcontinental country goes to Asia — Russia, Turkey,
  Kazakhstan, the Caucasus, and Cyprus with xc (the island stays whole) —
  while Egypt stays Africa and the Caribbean counts as North America.
  Anthem, Flag and Map keep their ⚙️ country list as one plain list and
  gain ➕/➖ beside select-all: each opens a small menu of continents, and
  picking one adds or removes that whole continent from the selection — so
  "no Asia" is two taps, and it composes with the round length below. The
  menu grew a second section the same day: **19 regions** — Caribbean,
  Central America, The Andes, the four African belts, Middle East,
  Central/South/Southeast/East Asia, the four
  European quarters plus the Balkans, and the Pacific Islands. Regions are
  deliberately not a partition: the Balkans overlap Southern and Eastern
  Europe, Egypt is in both the Middle East and North Africa, and a country in no group of six or more (the United States,
  Brazil, Australia, the Caucasus) simply has none — the continents above
  still reach everyone. Every region carries at least six countries, and a
  test asserts each one names only codes the atlas actually has, so a typo
  cannot quietly drop a country from its group.
- **Map: zoom to fit**, and it is the default. A 🔍 switch in ⚙️ — 🌍 whole
  world, or frame just what is in play. Framing costs nothing while
  everything is selected (that frame *is* the whole world), so it only
  shows itself once the choice narrows. Learning, that is the countries still selected: choose
  Africa in the checklist and the map opens on Africa. In a game it is the
  round's own board, so a dealt round of ten reframes on those ten, freshly
  each round. The frame is built from each country's *largest part only* —
  otherwise one antimeridian fragment (Fiji, Russia's Chukotka) or a distant
  territory would stretch it back across the whole map, which is the very
  thing the setting exists to avoid — and it rides the existing glide, so
  the map eases into place instead of jumping. Zooming in also dissolves
  dots back into real shapes for free: the marker threshold reads the target
  view, so Africa alone is drawn in far more detail than Africa-in-the-world.
  The near-miss forgiveness learned about it too: its ×2/×4 ladder is
  measured against the whole world, so from a frame already closer than a
  rung it would have pulled *back* — the opposite of help. A miss now takes
  a rung only when that rung is genuinely closer than what is on screen
  (from Africa's ×3.85, the first miss holds the frame and the second
  tightens to ×4), and the forgiveness radius shrinks with the zoom in
  effect, since finger error is constant on screen rather than on the map.
- **Round length: shorter games in Flag, Map and Anthem.** Two hundred
  targets make an honest round and a boring one. A new ⚙️ setting —
  10 · 20 · 50 · ∞, default 20 — cuts it: Flag and Anthem *deal* that many
  cards, a fresh shuffled hand every round on a grid small enough to scan;
  Map keeps the whole world visible and clickable and simply stops the
  round after that many targets (the score reads 0/20). The buttons say
  what they mean ("Play only 10" / "Whole board", in all eight interface
  languages), and unlike the rest of the panel the row locks only while a
  round is actually running — between rounds the next round's size can
  change without leaving the game, and the ready state's 0/N follows the
  change live. The country checklist keeps working and composes with it —
  selected set ∩ round length. Under the hood one `roundSize` option on
  `useGame`, frozen when the round starts; `RoundResult.total` now records
  the intended length. Map alone gets a second choice, because it shows
  every country whether or not it plays: 🌍 the whole map stays live and a
  click outside the round counts wrong (the default, today's behavior), or
  🃏 the round is *dealt* — only a drawn hand of countries plays and the
  rest sit out grey, code-less and unclickable like untaught land, exactly
  as if they were deselected.
- **The language pings.** sada's second endpoint is wired: every app tells
  `POST /v1/settings` when its interface or hearing language is switched
  (`{ app, ui_language, sound_language }` — anthem's hearing choice is its
  music type). A shared `useSadaSettings` hook fires on change only — the
  first render carries defaults and is skipped, so the stored settings
  loading registers once per visit and every real switch after that — and
  rides the same health gate and off switch as the rounds, so it can sit
  unconditionally in all eight apps. Server side, the ping's language-code
  limit grew from 8 to 12 bytes to fit anthem's 10-byte "instrument"
  (a one-line change in the sada repo).

Deployment notes, carried and still pending: the flag / color / number Vercel
projects need Root Directory, install command and domains updated by hand.
Face's home tile stays beta until flipped — face.sawt.info answers. Verb needs
its Vercel project created: sawt-verb, Root Directory `apps/verb`, install
command `npm ci --include-workspace-root --workspace=verb`, domain
verb.sawt.info — its home tile stays beta-gated until that answers. Map's
world.json is untouched this version, so no cacheVersion raise is needed;
sada needs nothing from Vercel, its switch and URL riding the committed
`.env` files.

## [0.29.0] 2026-08-29

The echo answers. sada (صدى) — the game-data collector planned since rounds
learned to record themselves — is live on Fly.io, and every game app now
offers each finished round to it, health-gated and fire-and-forget, so
analytics can never break a game. On the way there, game mode learned to
wait: 🕹️ opens a ready board at 0s and ▶️ fires the actual start, making
room for the pre-game options to come.

### Changed
- **🕹️ no longer fires the starting gun.** Entering game mode now shows the
  board ready to play — score at zero, clock at 0s — and the first round
  waits for ▶️, in every game app. One click used to do both; the pause
  exists because pre-game options are coming, and they need somewhere to
  live before the first prompt is spoken.

### Added
- **The apps now speak to sada.** The game-data collector (sada — صدى, the
  echo) got its client side in `@sawt/game`. Configuration first:
  `SADA.enabled` and `SADA.baseUrl`, read once per build from
  `VITE_SADA_ENABLED` and `VITE_SADA_URL` — both must be set (the switch
  the literal `true`, the URL well-formed) or sada stays off and round data
  keeps living in the browser, exactly as today; dev builds get no special
  treatment. Then the sender: every finished round in all eight game apps
  is offered to `POST /v1/rounds` as `{ app, round }`, fire-and-forget with
  keepalive, and health-gated — a round only leaves when a recent
  `GET /health` said the collector is up. Health is asked at most once per
  10 minutes, never once-per-send, and the verdict (either way) is cached
  that long, so a dead collector costs one aborted probe every 10 minutes.
  And it is ON: each game app carries a committed `.env` with
  `VITE_SADA_ENABLED=true` and `VITE_SADA_URL=https://sada.sawt.info` (not
  secrets — the values are baked into the public bundle either way), so dev
  and production both send. Turning it off is deleting the file or flipping
  the switch.
  Every failure is swallowed: analytics must never break the game. The
  server itself does not exist yet — until it answers, the health gate
  keeps everything exactly as quiet as before.

Deployment notes, carried and still pending: the flag / color / number Vercel
projects need Root Directory, install command and domains updated by hand.
Face's home tile stays beta until flipped — face.sawt.info answers. Verb needs
its Vercel project created: sawt-verb, Root Directory `apps/verb`, install
command `npm ci --include-workspace-root --workspace=verb`, domain
verb.sawt.info — its home tile stays beta-gated until that answers. sada
itself needs nothing from Vercel: the committed `.env` files carry its
switch and URL into every build.

## [0.28.0] 2026-08-29

The Map grew up. Its 24 hand-kept marker dots became a live computation that
fits any screen, its tooltip stopped sliding off the right edge, and the sea
learned who it belongs to: 121 countries now carry a generated clickable-water
shape — each island cluster's hull clipped by the equidistance line real EEZ
boundaries use — so Hudson Bay answers as Canada, the Sea of Okhotsk as
Russia, and the Aegean splits island by island between Greece and Turkey.
That made honest targets of the eight beta island nations, and all of them
went live. Two game bugs died on the way: the near-miss zoom no longer
strands the player on the wrong side of a round earth, and a finished
round's zoom no longer haunts the next one.

### Changed
- **All eight beta island nations leave beta on the Map** — Kiribati,
  Micronesia, Tonga, São Tomé and Príncipe, Cape Verde, Comoros, Samoa and
  Mauritius. They were hidden because their islands are sub-pixel slivers at
  world scale; the dynamic markers now give each a dot at any width and the
  generated water shapes make the sea between their islands clickable, so
  there is finally something to click. The Map's beta list is empty.
- **Map's markers went dynamic.** The hand-kept MARKERS table — 24 dots with
  hand-tuned radii and two hard-won hit-circle surgeries — is now a live
  computation: a country draws as a dot when its largest single part would
  render under ~3 CSS pixels at the current map size and zoom. A phone shows
  more dots than a desktop (67 vs 35 at today's threshold), growing the
  window dissolves borderline dots back into their real shapes, and the
  near-miss zoom does the same mid-game. The two old hazards became rules:
  a dot's hit circle stays inside half the distance to its nearest fellow
  dot, and off the boundary of any nearby country still drawn as a shape
  (the Bahrain-eats-Qatar class). Hand knowledge kept: Gibraltar's position
  (absent from the atlas) and the Pearl River Delta nudge. Full click-audit
  passed at 375, 1280 and 1600 px. Side effect worth deciding on: the eight
  beta islands now get honest dots automatically in dev builds — their beta
  flags may no longer be needed.

### Fixed
- **The earth is round, the near-miss zoom forgot.** A country straddling
  the antimeridian (Kiribati) has geometry on both edges of the map, so in a
  game a click at the far right measured "near" even though the country's
  clickable dot sits at the far left — and the near-miss forgiveness then
  zoomed the view onto the empty side, where the target could never be
  clicked. The forgiveness now also demands the click be on the target's
  side of the world (within half a world of its main part), so wrong-edge
  clicks count as ordinary misses and the view stays winnable. And the
  forgiveness state now dies with the round: it used to linger keyed by
  country code, so once a later round asked the same code — near-certain
  with only two countries selected — the stale zoomed view snapped back
  before the player had clicked at all.
- **Map's tooltip stays on screen.** It always sat 12px right of the cursor,
  so hovering the far east — Japan, Fiji, New Zealand — pushed it off the
  edge. It now flips to the cursor's left when it would cross the right
  margin (and drops below the cursor near the top), measuring its width once
  per show so the per-move handler still never forces a layout read.
- **A country's water can now be clickable, by hand — and interaction split
  from visuals with one uniform rule.** The map renders two layers: an event
  layer holding every country's clickable geometry — `h` from world.json
  when hand-authored, its own land otherwise — and a visual layer above it
  that draws the states but never receives a pointer. No special cases:
  hovering any event shape lights up its visual twin, keyboard focus lives
  on the event layer, hand shapes paint first so real geometry beats a hull
  that reaches too far, and untaught land sits code-less in the event layer,
  still inert by construction. 121 countries carry a generated hand
  shape: the convex hull of each of their island clusters, clipped by
  **equidistance** — water stays a country's only while closer to its
  coast than to any neighbour's, the median-line principle real maritime
  EEZ boundaries use (the user pointed at OpenStreetMap's economy line;
  this reproduces it on our projection). Hudson Bay clicks as Canada with
  the border mid Nares Strait, not on Greenland's coast; the Sea of
  Okhotsk clicks as Russia; the Aegean splits island by island between
  Greece and Turkey; the Baltic, the Caribbean and the Gulf of Thailand
  tile the same way. Clustering keeps hulls local — Hawaii, the Azores,
  Galápagos and France's overseas parts get their own, and antimeridian
  fragments (Fiji, Chukotka) never drag a hull across the map — while
  enclosed seas ringed by many (mid Black Sea) stay nobody's because each
  hull only reaches its own coastal wedge. Enclaves stay real holes: hit
  shapes render with fill-rule evenodd, so Brunei's notch is carved out of
  Malaysia's shape. Countries gaining under 3 units² of water stay
  land-only; the generated lines never dip more than half a pixel into
  foreign land. `tools/gen_hit_shape.py --all --write` regenerates the lot.
  The hand shapes rendered translucent during review and are fully
  transparent now that they are approved — the water simply answers.
  world.json edited in place, so the map's cacheVersion rose to 5. Two hit-testing traps found by
  the audit on the way: the marker dots carry the .country class, so the
  visuals-take-no-pointer rule had to be path-scoped or the dots died; and
  `pointer-events: all` hits the *unpainted stroke geometry*, whose default
  one-unit band let Malaysia's border blanket Brunei and Senegal's the
  Gambia — the event layer hits `fill` only; and the hover highlight had
  been keyed on tooltip data, which game mode strips so hovering cannot leak
  the answer — it now keys on the hovered shape itself, so the highlight
  survives game mode and reaches untaught land and the dots again; and the
  focus-outline suppression moved from `.country` to `.hit-shape` with the
  layers, which orphaned the marker dots — clicking one drew the browser's
  default bounding-box ring around it until the dots got their own rule
  (keyboard focus still rings the dot itself). An
  earlier automatic approach
  (stroke pads around every coastline) was built, verified and replaced —
  pads could not say "all of Hudson Bay is Canada" without claiming every
  strait.

Deployment notes, carried and still pending: the flag / color / number Vercel
projects need Root Directory, install command and domains updated by hand.
Face's home tile stays beta until flipped — face.sawt.info answers. Verb needs
its Vercel project created: sawt-verb, Root Directory `apps/verb`, install
command `npm ci --include-workspace-root --workspace=verb`, domain
verb.sawt.info — its home tile stays beta-gated until that answers. The Map
deploys itself: world.json changed in place, and cacheVersion 5 makes every
returning browser refetch it once.

## [0.27.0] 2026-08-23

The verbs learned time, and the family learned discipline. Verb speaks at
four moments (❗ ⏳ ⏪ ⌛ — Arabic deliberately shows three) and grew from two
verbs to seven with die Lehrerin as its second character. Flag and Map went
from mostly-English to answering everything in four languages. Every grid
game gained a 🧹 sweep, the round clock learned hours and days, rounds now
record how every target went, and the repo got its first tests and CI.
Anthem brought Luxembourg out of beta and gave Italy its words.

### Added
- **Verb: the moments** — every verb now speaks at four points in time,
  switched globally from the app bar (❗ ⏳ ⏪ ⌛): do! (the command), doing
  (now), did (simple past) and done (the perfect). Moments, not tenses:
  each language fills a moment with its own natural form, and the animation
  behavior carries the grammar — do! loops anticipation and never starts,
  doing loops the action, did plays the event once before your eyes and
  rests (tap to run it again), done never shows the action, only the result
  it left. Every verb gained three hand-drawn scenes (8 animations total);
  30 recordings replace the old 8 (the citation forms — eat/essen/äta — fit
  no moment and retired). Arabic shows three moments: its ماضي speaks over
  the done aftermath scene and the play-once past is hidden (قد أكل adds
  nothing a child would hear). German's did is Präteritum, its done the
  spoken Perfekt — ist geschwommen, with sein. New `?m=` URL parameter;
  sounds moved to `lang/<l>/<scene>/<code>.aac`, animations to
  `anim/<code>.<scene>.svg`, cacheVersion raised to 2.
- **🧹 Sweep, in every grid game** — a new round action between 🤷‍♂️ and ⏹️:
  one tap resorts the board so everything already played (guessed or given
  up) moves to the end, in stable order — late in a long round the remaining
  targets stop hiding between the solved cards. Implemented once in
  `@sawt/game` (`sweepSolved` + an opt-in `onSweep` on GameActions) and
  enabled in flag, color, number, anthem, face and verb. Deliberately absent
  from week (the day order is the content) and map (its layout is
  geography). Disabled until something is solved.
- **The round clock grows with the round** — ⏱️ used to stop making sense
  past an hour; it now reads `4 s` · `1:01` · `59:34` · `1:09:03` ·
  `3 days 09:20:03` — seconds alone under a minute, then m:ss, then h:mm:ss,
  and past midnight whole days, spelled out and localized (`time.day` /
  `time.days` in every dictionary of all eight game apps, Week's Hebrew
  included). One formatter in `@sawt/game` serves everyone.
- **Five classroom verbs — and die Lehrerin.** Verb grows from two to seven:
  cut, listen, paint, raise-the-hand (sich melden) and share join eat and
  swim, each with four hand-drawn moment scenes (20 new animations, 2–4 kB
  apiece) and recordings in all four languages (75 new files). The teacher —
  bun, glasses, teal dress — debuts as the app's second recurring character:
  she talks in listen, asks in raise-the-hand, receives in share. German
  notes: sich melden's Perfekt is „hat sich gemeldet", and the source
  worksheet's „gemeltet" was corrected.
- **German everywhere in Flag and Map.** The 162 entries that spoke only
  English (158 in Map) gained German recordings — spoken from each entry's
  own `name.de`, the house voice (de-DE-KatjaNeural), matching the library's
  22 kHz mono format. Flag now answers in German for all 207 entries and Map
  for all 202; picking Deutsch no longer greys most of the world out. The
  same batch then ran for Swedish (sv-SE-SofieNeural, from `name.sv`) and
  Arabic (ar-SA-HamedNeural, from `name.ar`) — Flag and Map now answer in
  English, German, Swedish and Arabic for everything. The remaining gap is
  six languages (see TODO.md). New files only, so no cacheVersion raise.
- **Anthem: Luxembourg is live, Italy has its words.** Ons Heemecht left
  beta complete: a score from the World Atlas MIDI's dedicated Melody track
  (73 notes, polyphony 1 — no extraction needed), moved down a fourth to the
  recording's B♭ where all 73 land diatonic, tempo 99 confirmed by both of
  the recording's strains independently, plus the 1993 law's two stanzas as
  lyrics. Italy gained its intro point and Mameli's words (first stanza +
  the Stringiamci refrain, carved from Wikisource); its melody attempt — a
  spliced brass arrangement — didn't survive the ear test and waits for a
  cleaner source. `tools/fetch-lyrics.py` learned three tricks on the way:
  a `take` option that carves stanzas out of unbroken poem blocks, comment
  and template cleanup, and inline wiki-link unwrapping.
- **Rounds now remember how each target went.** A finished round used to
  keep only totals; every `RoundResult` now carries `targets` — for each
  thing asked, in order: its code, every wrong tap made while it was up
  (in click order), and whether it ended in 🤷‍♂️. "Asked for the US flag,
  tapped UK and FR first" is now `{ code: 'us', wrong: ['uk', 'fr'],
  gaveUp: false }`, and "tenth of fifty" is its index against `total`.
  Each round also carries a random UUID (`id`), the board as shown
  (`board`: every code in order), and each target records how long it was
  up (`ms`, counted from being asked — its prompt sounds ~650ms later).
  One change in `@sawt/game`, inherited by every game app; the data stays
  in memory for now — it is the schema future analytics will read.
- **🧪 a dev-only round inspector, and rounds that stick around.** Round
  results now accumulate for the whole page visit instead of being wiped on
  leaving game mode, and a new toolbar button — visible only in dev builds
  and with VITE_SHOW_BETA=true, rendered nothing in production — opens every
  recorded round as formatted JSON, per-target detail included. One shared
  component in `@sawt/game`, wired into all eight game apps.
- **The repo's first tests, and its first CI.** `@sawt/game` gained a vitest
  suite over the whole game state machine — rounds, wrong-guess bookkeeping,
  give-ups, the 🧹 sweep partition, the per-target records with ids, boards
  and timings, and results surviving game-mode exits (9 tests, checked to
  actually fail when the logic is broken). A GitHub Actions workflow now
  runs the lockfile-strict install, typecheck, ESLint, the tests and all
  nine app builds on every PR and push to main — `npm test` at the root
  fans out to any workspace that defines one. To keep CI green over known
  debt, the shared `react-hooks/set-state-in-effect` findings (the
  settings-load pattern every app shares) became warnings, and CI caps
  warnings at today's 24 — one new finding of any kind fails the build.
  The config also moved off the deprecated `tseslint.config()` helper onto
  ESLint core's `defineConfig()` — byte-identical findings before and after.

### Changed
- **Home got the `engines` block its eight siblings had** (`node >=20.19.0`,
  `npm >=9`, `packageManager npm@11.18.0`). On Vercel, `engines.node`
  overrides the project's dashboard Node setting and a `>=` range resolves
  to the newest available major — so every sawt project now builds on the
  latest Node (24.x today) no matter how old its dashboard configuration is.
  Home was the only app still following its dashboard.

Deployment notes, carried and still pending: the flag / color / number Vercel
projects need Root Directory, install command and domains updated by hand.
Face's home tile stays beta until flipped — face.sawt.info answers. Verb needs
its Vercel project created: sawt-verb, Root Directory `apps/verb`, install
command `npm ci --include-workspace-root --workspace=verb`, domain
verb.sawt.info — its home tile stays beta-gated until that answers.

## [0.26.0] 2026-08-16

A new app. Verb joins as the ninth: action words a child performs in short
hand-drawn animations — the repo's first pictures that move — starting with
eat and swim in four languages.

### Added
- **`apps/verb`** — Verb joined as the ninth app: learn action words from a
  child performing them. Each verb is a hand-drawn, CSS-animated SVG of the
  same kid (`public/anim/<code>.svg`, a few kB each, no GIFs, no player
  library) that loops in a plain `<img>`, carries its own
  prefers-reduced-motion stop, and rides the sound cache the way Map's
  world.json does — so ✈️ flight mode covers pictures and sounds alike.
  Starts with two verbs (eat, swim) spoken in four languages (en ar de sv),
  with the usual game mode, settings, URL parameters and eight interface
  languages. Home gains a beta-gated Verb tile. `tools/regen-audio.py`
  regenerates the recordings; Arabic speaks the present tense (يَسْبَح، يَأْكُل),
  the form children's books use.

### Security
- `npm audit fix` — nanoid bumped 3.3.17 → 3.3.18 (transitive, via the Vite
  toolchain); no runtime dependency changed

Deployment notes, carried and new: the flag / color / number Vercel projects
still need Root Directory, install command and domains updated by hand.
Face's home tile stays beta until flipped — face.sawt.info answers. Verb needs
its Vercel project created: sawt-verb, Root Directory `apps/verb`, install
command `npm ci --include-workspace-root --workspace=verb`, domain
verb.sawt.info — its home tile stays beta-gated until that answers.

## [0.25.0] 2026-08-16

A map release. The world map learned to behave on a phone held sideways, its
tooltips and display now lead with the flag, and its settings list countries by
name instead of a wall of bare flags. Flag and Map gained the UK's remaining
countries, China's two special regions, Northern Cyprus and the European
Union — 207 entries in Flag, 202 in Map.

### Added

- **The UK's four countries, in Flag** — Wales 🏴󠁧󠁢󠁷󠁬󠁳󠁿, England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 and
  Northern Ireland 🏴󠁧󠁢󠁮󠁩󠁲󠁿 join Scotland. They are Flag exclusives: the map's
  United Kingdom is a single shape with nothing of their own to click.
  Northern Ireland has no RGI emoji anywhere — no official flag exists — so
  its glyph is this project's own, drawn by the owner into flags.woff2 along
  with the missing `i` and `r` tag letters
- **Northern Cyprus 🇽🇨, Hong Kong 🇭🇰, Macau 🇲🇴 and the European Union 🇪🇺.**
  Northern Cyprus has no ISO code and, unlike Kosovo's `xk`, no de-facto one
  either, so `xc` and its glyph are both this project's own; its code-less
  world.json shape now carries that code. The EU is Flag-only — a union of 27
  with no borders of its own, and `eu` is exceptionally reserved rather than
  assigned. Hong Kong and Macau sit 1.7 units apart on the map, close enough
  that visible dots would merge, so the pair is nudged a little either way
  along its own axis
- **The round actions moved next to the toolbar, in every app with a game**
  — in a round the bar now reads toolbar, actions, display, score from the right, so
  the two things pressed during a round are next to each other rather than at
  opposite edges. Visual `order` only: the display and score hold nothing
  focusable, so keyboard order still runs toolbar → actions. Below each app's
  stacking breakpoint (900px in Week, 760px elsewhere) it reverts to
  top-to-bottom order
- **Flag and name together** — Map's display and its hover tooltips lead with
  the country's flag, the glyph a touch larger than the name with a soft
  shadow under it, and the tooltip reshaped into a pill. Land the app does not
  teach keeps its atlas name with no flag and no gap
- **`tools/sync-flags-font.py`** in visual-design copies a rebuilt flags.woff2
  into every sawt app that ships it, discovering them rather than listing
  them, and refusing to copy a font that would drop a flag any app renders

### Changed

- **Map scrolls on a short screen.** The stacking breakpoint is width-only, so
  a phone in landscape got the tall column bar with barely any height left,
  and `height: 100dvh` plus `overflow: hidden` meant no way out — Map was the
  only app in the family pinned to the viewport instead of letting the
  document scroll. Those are min-heights now, with a floor of `100vw / 2.284`
  on the map area: the atlas aspect, i.e. the height that draws the whole
  world at full width. When the bar leaves less than that the page scrolls and
  the bar scrolls away with it. Roomier viewports are untouched
- **Map's settings list countries by flag and name**, sorted by the interface
  language's own collation and re-sorted when it changes — the same shape as
  the language checklist above it. A grid of bare flags stopped being readable
  somewhere past 200 of them
- **The Morocco / Western Sahara boundary is the straight 27°40′N parallel**,
  the old Spanish Sahara line. Natural Earth ships the Moroccan Wall, which
  left Western Sahara as only the Free Zone east of the berm; both rings now
  meet on the parallel and share its endpoints exactly, so no sliver of sea
  opens between them
- **Eight island countries are beta in Map, still live in Flag** — Kiribati,
  Micronesia, Tonga, São Tomé and Príncipe, Cape Verde, Comoros, Samoa and
  Mauritius. Each one's largest single part is smaller than Luxembourg, the
  smallest shape that still reads as a country, and three have a largest part
  of zero area. They are spread too far across open ocean for one dot to be
  honest. 194 countries on the map in production, 202 in a beta build
- **The Map tile is live on the home page** now that map.sawt.info serves —
  six tiles in production
- Afghanistan's flag redrawn (16 colour layers to 9); Anthem's copy of
  flags.woff2 had drifted two rebuilds behind and is back in step
- Both in-place atlas edits ride a single audio-cache raise, **cacheVersion 3**
  — one raise discards the old world.json for everyone

### Fixed

- Map's hover tooltip never went away, it only changed text on the next hover.
  Making it a flex pill gave `.map-tooltip` a `display` that beat the
  browser's own `[hidden] { display: none }`, so the attribute the pointer
  handlers had been setting all along did nothing. It also clears now whenever
  the tooltip's rules change — entering or leaving a game, switching interface
  language — which pointer events alone miss when a game starts from the
  keyboard

Deployment notes, carried from 0.23.0 and still pending: the flag / color /
number Vercel projects need Root Directory, install command and domains
updated by hand. Face's home tile stays beta until its subdomain is linked —
face.sawt.info now answers, so it is likely ready to go live.

## [0.24.0] 2026-08-12

The whole world release. Flag and Map grew from 45/44 countries to
**200/199**.

### Added

- **155 countries in Flag and Map**, added biggest-by-area first in batches
  of ten, recorded in English only for now (Ava, the library's en voice).
  The `Country` type gained `sounds?: SoundLanguage[]` for partial coverage:
  a country outside the selected hearing language shows disabled (Flag) or
  grey (Map) instead of clicking silently — 155 of the 200 are English-only
  today, and every recording beyond English is content still to make
- **Near-miss forgiveness in the Map game** — a finger aiming at a small
  country easily lands on a neighbour or in the sea. A wrong click within
  `MISS_FORGIVENESS` (30 map units at ×1, scaled with the zoom) of the
  target is not counted: the map zooms `MISS_ZOOM` (×2) around the click and
  the player tries again, at most `MISS_ZOOM_LIMIT` (2) times per prompt, so
  ×4 in total. Zooming centres on the click, never the target, so it cannot
  leak the answer; ocean clicks near the target count as near misses too.
  The view glides both ways (400 ms ease-out tween on the viewBox, geometric
  on scale) and snaps instantly under prefers-reduced-motion and in hidden
  tabs, where rAF is starved
- **Eighteen more marker dots** — every micro-state too small to draw joins
  Vatican City, Andorra and Gibraltar as a clickable dot at its own
  location, 22 dots in all. Markers gained optional per-dot radii: in the
  Lesser Antilles chain (seven dots 2.4–4.8 units apart) the dots and hit
  circles shrink so none swallows a neighbour's centre
- **TODO.md** — the country campaign's checklist while it ran; now the
  content roadmap (the other nine sound languages, and the interface-only
  three), linked from the root README

### Changed

- **The map frame is the full world** — world.json's crop (0..1000) cut the
  projection's edges off; it now carries `x0: -7, width: 1014`, the
  projection's true extent, and the viewBox honors the origin. Tuvalu, which
  the old crop dropped entirely, is hand-placed at Funafuti's true projected
  position (Natural Earth 50m omits it); Kosovo's code-less shape now
  carries `xk`. Both in-place atlas changes ride one audio-cache bump,
  cacheVersion 2
- **Map's languages are defined once** — `src/languages.ts` holds
  `SoundLanguage` (ten recorded), `UiLanguage` (eight interface) and their
  union `AllLanguage`; `Country.name` is a `Record<AllLanguage, string>`
  with all thirteen names, replacing the separate `label` record
- **Iran and Ukraine leave beta** — fully recorded in all ten languages,
  now visible in production in Flag and Map

### Fixed

- Clicking a map country no longer draws the browser's focus rectangle
  around it; keyboard focus keeps its shape-following ring
- Qatar and Switzerland were unclickable in both modes: the Bahrain and
  Liechtenstein marker dots paint on top of the map, and their default
  8-unit hit circles swallowed both countries whole. Their circles shrank
  to 2 (Monaco, Malta and Singapore trimmed too), verified by real
  hit-testing across every affected country's vertices

Deployment notes, carried from 0.23.0 and still pending: the flag / color /
number Vercel projects need Root Directory, install command and domains
updated by hand (the old plural domains attached so the 308s fire), and the
face and map home tiles stay beta until face.sawt.info and map.sawt.info
exist.

## [0.23.0] 2026-08-11

A naming release and a new app. Every app and domain moved from plural to
singular — flags -> flag, colors -> color, numbers -> number — and **Map**
joined as the eighth app: flag's countries on a world map, taught by *where*
instead of by flag. Face grew from six faces to nine.

### Added

- **`apps/map`** — the whole area below the app bar is an interactive world
  map. Hovering a country shows its name in the interface language; clicking
  plays it in the sound language; the game says and shows a name and you find
  the country. No sort and no shuffle anywhere — geography is the layout.

  Flag's 44 countries and all ten recordings per country, except Scotland: the
  map's United Kingdom is a single shape, so `gb-sct` stays a Flag exclusive.
  Vatican City, Andorra and Gibraltar are too small to draw at world scale and
  appear as clickable dots at their true locations. Countries the app does not
  teach are drawn grey and inert; in the game a wrong click marks that country
  red until the round's target is found, a give-up turns it amber.

  Hover names follow the interface language, which needed names in the three
  interface languages that are not sound languages — each country carries an
  `el`/`th`/`zh` label record alongside its spoken names. The map itself is
  `world.json` from palestinethanksyou.com (Natural Earth 50m, public domain,
  projected with d3-geo's Natural Earth projection), loaded through the sound
  cache — so ✈️ flight mode makes the whole app work offline, map included

- **Face: kiss 😚, cry 😭 and sleep 😴** — three doings join the six feelings,
  nine faces on the board. The words follow what a child actually hears rather
  than the dictionary: Swedish *puss* (not kyss), Arabic *بوسة* (not قبلة), the
  verbs in their everyday forms. Sad keeps its tearful 😢 beside 😭 by choice

- `tools/regen-audio.py` in Face carries all nine words per language, so every
  recording stays re-derivable

### Changed

- **flags -> flag, colors -> color, numbers -> number** — app names, packages,
  subdomains, storage keys and cache databases all moved to the singular, and
  every sister link follows. Each rename is a new subdomain, i.e. a new origin:
  settings and cached sounds do not carry over, and the Vercel projects need
  their Root Directory, install command and domains updated by hand (see the
  README's deploy notes)
- **The old plural URLs redirect.** flags/colors/numbers.sawt.info 308 to
  their singular successors with path and query intact — a host-conditional
  redirect in each renamed app's `vercel.json`, the same pattern home uses for
  the apex. Live once the old domain is attached to the renamed project
- The home tile for Numbers said 0–12; the app has reached 0–15

## [0.22.0] 2026-08-10

One new app: **Face** — the seventh — teaching six feelings as emoji faces
(angry 😠, confused 😕, happy 😀, sad 😢, scared 😨, surprised 😮), spoken in
Arabic, English, German and Swedish with the same voices the sister apps use.

### Added

- **`apps/face`**, the full family shell: game mode, settings with language and
  face checklists, flight mode, share links, the four URL parameters, all eight
  interface languages. The faces are emoji characters for now — they differ by
  platform until a custom face font is drawn, the flags.woff2 approach — and
  the first app born with the 0.21.1 Safari audio pattern (one shared, unlocked
  element) instead of retrofitting it. Home gains a beta-gated Face tile, so
  production never links to a subdomain that does not exist yet
- `tools/regen-audio.py` in Face records every voice and word, so the 24
  recordings stay re-derivable

### Fixed

- **A 200 is not proof of audio.** Vite's dev server answers a missing sound
  file with index.html and a 200 — and a captive portal or CDN error page does
  the same to a deployed app — so the shared cache stored an HTML page as a
  recording, permanently, and playback failed forever after. `@sawt/audio-cache`
  now refuses to return or store anything that admits to being HTML, and Face's
  cache version starts at 2 to discard entries poisoned during development

## [0.21.1] 2026-08-09

Anthem was silent in Safari, and starting a game there left it on ⏳ for good.
Both worked in Chrome, which is what made them easy to miss.

### Fixed

- **Nothing played in Safari.** Safari gives permission to play sound to the call
  stack of a click, not to the page, and only to the element that asks. Anthem
  fetched the recording first and built a fresh `Audio` afterwards — by then the
  click was over and the new element had no permission, so `play()` was refused.
  The refusal was discarded, so it failed in silence. Now one element is kept and
  unlocked on the first click, and a refusal is reported rather than swallowed.

  Chrome takes any earlier interaction on the page as consent, which is why it
  never showed there.

- **The synthesized 🎼 melody was silent for the same reason.** Safari starts an
  AudioContext suspended and only honours `resume()` from inside a click, and a
  suspended context's clock does not advance — so notes scheduled against it are
  written into a timeline that never arrives. The context is now built and resumed
  from the click itself.

- **Starting a game in Safari hung on ⏳.** The flag that shows it was cleared
  after preloading the round's sounds, on the assumption that preloading always
  finishes. Safari's IndexedDB can leave an `open` request pending forever — no
  success, no error, not even `blocked` — and everything waiting on the cache
  waited with it. Two fixes: opening the database now gives up after three
  seconds and falls back to the network, and the ⏳ comes down in a `finally`, so
  a preload that fails or never returns can no longer stop the game starting.

## [0.21.0] 2026-08-08

An Anthem release. Seven countries left beta — Germany, Denmark, Egypt, Spain,
France, the United Kingdom and Hungary — which takes the app from 15 playable
countries to 22 and leaves 11 in beta. Each was taken through the same ordered
pass, now written down in Anthem's README so it is a procedure rather than a
habit.

One thing outside Anthem: replacing two recordings exposed a bug in the shared
audio cache, which is fixed below.

### Added

- **Seven anthems out of beta**, each with a 🎼 written melody, and with the
  words where they are old enough to carry:

  | | 🎼 tempo | 🥁 intro | words | |
  | --- | --- | --- | --- | --- |
  | 🇩🇪 Germany | 71 | — | German | |
  | 🇩🇰 Denmark | 79 | — | Danish | |
  | 🇪🇬 Egypt | 96 | 3.5 s | Arabic | |
  | 🇪🇸 Spain | 76 | — | — | has none — words were written twice but never adopted |
  | 🇫🇷 France | 116 | — | French | |
  | 🇬🇧 United Kingdom | 88 | 11.8 s | English | 👥 choir recording |
  | 🇭🇺 Hungary | 59 | 17.25 s | Hungarian | |

- Words for Denmark, Egypt, France, the United Kingdom and Hungary, at
  `public/lyrics/<code>/<language>.txt`. Only anthems whose words are public
  domain are carried, and where a country sings one stanza of a longer poem only
  that stanza is kept — Hungary's Kölcsey runs to eight

- A 👥 choir recording for the United Kingdom. It is the project's **first asset
  that is not public domain**: CC BY 2.0, so the attribution in Anthem's README is
  a licence condition rather than a courtesy, and has to travel with the app

- `midi/README.md` gains a section for **scores not derived from MIDI**. Hungary's
  came from a LilyPond setting on Wikipedia instead, which is the better source
  where it exists — no melody line to guess at and no arranger's octave doublings
  to see through

- Anthem's README documents **how a country leaves beta**: the seven steps, in
  order, from finding a reference recording to fetching the words

### Changed

- France's and the United Kingdom's recordings are now **US Navy Band**
  performances, replacing weaker ones
- `tools/fetch-lyrics.py` refuses to overwrite an existing lyrics file without
  `--force`, since several had been corrected by hand and a re-run would have
  silently undone that work. It also strips stray markup, which had previously
  reached the Danish file as literal `<br>` on every line

### Fixed

- **Replacing a sound file left everyone who had cached it with the old audio.**
  `@sawt/audio-cache` stores blobs in IndexedDB keyed by URL, with no expiry and
  no revalidation, so a file replaced at the same path stayed stale until the
  user cleared the cache by hand. Mostly that meant hearing an old performance —
  but the United Kingdom's new recording also moved its intro point, so the 🎺
  rendering would have started a quarter of the way into the tune. Each app now
  passes a `cacheVersion` that discards the cache when raised; Anthem's is at 2

## [0.20.0] 2026-08-05

Started as a content release and grew past it. Alongside the new items and
languages there is a shared deep-link package, a rendering type, and two changes
that break old links: the URL parameters were renamed, and Colors' codes moved
onto a five-step ladder. Both are described below; neither leaves an app in a bad
state, since an unusable parameter is ignored rather than applied.

### Added

- `packages/url-state` (`@sawt/url-state`) — one shared, unified set of
  deep-link parameters, replacing five separate implementations:

  | | |
  | --- | --- |
  | `?i=` | items visible — a list of codes, or a range where one fits |
  | `?l=` | interface language |
  | `?s=` | sound: which spoken language, or which anthem rendering |
  | `?t=` | theme |

  "Sound" is the axis deciding which audio an item produces. In Anthem that is
  the rendering rather than a language, and it is a single choice with nothing to
  hide, so `?s=` takes one value there and a list elsewhere. Theme and interface
  language were previously unreachable from a URL

- Anthem can now sort its cards, like Flags and Colors: ⇵ by code (the default),
  by name, or a frozen random order. It is the app where a name sort earns its
  keep most — with 🔤 name display the cards are text, so alphabetical order
  actually helps you find a country, whereas Flags' cards are emoji and an
  alphabetical-by-spoken-name order is one you cannot see

- **Numbers now answers `?i=` too, as a range: `?i=0-9`, `?i=10-12`, or `?i=7`
  for a single number.** It is the one app whose items are a contiguous ordered
  run, so a range is what a link wants to say — `?i=0-9` rather than
  `?i=0,1,2,3,4,5,6,7,8,9`. Both ends are inclusive, reversed ends are accepted,
  and a range that runs off the board is ignored like any other unusable value.

  The ends are resolved by position in the board's own order rather than by
  comparing the codes, because these codes are strings: compared as text, `'10'`
  sorts before `'9'`, and `?i=10-12` would have come out empty.

  The range is a shorthand rather than a replacement — a comma anywhere makes the
  value a plain list, since the settings checklist can produce a hand-picked set
  like `0,1,5` that no range describes, and the copy-link button has to be able to
  write it. Ranges stay opt-in per app because Flags has a code with a hyphen in
  it, `gb-sct`, which must never be read as one.

  Numbers had no hideable items before this, so it also gains a `hiddenDigits`
  setting and a numbers checklist in the settings panel, beside the languages
  one. That checklist is the point rather than a bonus: without it a shared
  `?i=0-9` link would persist to localStorage on the next settings change and
  leave 10, 11 and 12 unreachable — the same trap the 0.20.0 validation fix
  closed for mistyped codes. Flight mode also now caches only the numbers still
  on the board, so narrowing the range no longer downloads all thirteen

- **🔗 in the settings panel copies a share link to what is on screen**, in all
  five apps. Deep links existed but had to be typed by hand, which meant knowing
  the parameter names and every item's code — so in practice nobody made one.

  `writeUrlParams` is the exact inverse of `readUrlParams`: whatever the button
  writes reads back as the same state, verified as a round trip over ranges,
  hand-picked sets, single items and full sets. Two things are left out on
  purpose — `i` when nothing is hidden, because listing all fifty-odd countries
  to say "everything" is worse than saying nothing, and `t` for `system`, which
  means "follow the device" rather than a choice worth pinning on someone else's
  screen. Each app contributes what it actually has: Week emits no `i` (its seven
  days are fixed), Numbers emits a range where one fits, and Anthem's `s` is a
  single rendering.

  The button reports what happened rather than assuming success: ✅ when the text
  is on the clipboard, ⚠️ when it is not. `navigator.clipboard` needs a secure
  context, so it is unavailable over plain HTTP — a phone opening these apps
  across the local network, which is a real way they get used — and it also
  rejects when the page is unfocused or permission is refused. Those fall back to
  the older select-and-copy path, and only a failure of both shows ⚠️

- **Thirteen, fourteen and fifteen in Numbers**, with their thirty-three
  recordings — the board goes 0–15, and `?i=13-15` works like any other range.

  Arabic keeps the masculine forms (ثلاثة عشر) and Hebrew the feminine
  (שלוש עשרה), each matching what eleven and twelve already had, so neither
  sequence changes gender part-way up. In the Arabic compounds the ten-part stays
  masculine while the unit-part carries the ة — عشر with ثلاثة — which is the
  pattern the whole 0–15 run already followed.

  Worth knowing for anyone adding more: the app's audio has never been from one
  source. English came from archive.org, German, French, Swedish and Russian from
  Wiktionary and Wikimedia, and Turkish, Finnish and Spanish from ttsfree, while
  eleven and twelve were added later with Edge voices — so in those languages the
  voice changes part-way up the run. Turkish and Finnish additionally still have
  0–10 at 44.1 kHz stereo against 24 kHz mono above. Arabic is now the one language
  free of this (see below); the rest are unchanged for now

- **Violet (`#8000FF`) in Colors**, with its six recordings. It differs from
  purple `#800080` only in the blue channel, which is exactly the relationship the
  two names describe. It first shipped as the three-digit `70f` (`#7700FF`, the
  closest shorthand could get) and became exact once the palette moved to
  six-digit codes, below

- **Magenta (`#FF00FF`) in Colors**, with its six recordings. It was the only missing
  corner of the RGB cube — the palette had the other seven — and the partner of a
  cyan that was already there, leaving a visible hole between pink `#FF80BF` and
  purple `#800080`.

  Named with the loanword in Arabic, Ukrainian and Hebrew (ماجنتا, Маджента,
  מג'נטה), as Cyan already is in German, Swedish and Hebrew: none of the three has
  an everyday native term for `#FF00FF`. أرجواني looks like the Arabic word for it
  but is not — Arabic separates spectral violet بنفسجي (`#8000FF`) from
  non-spectral purple أرجواني (`#800080`) from ماجنتا, and `#800080` is the purple
  swatch itself. Ukrainian likewise treats Пурпуровий as the whole
  purple sector, with Маджента the narrowed part of it

- **🇨🇿 Czechia leaves beta, and 🎤 finally splits into solo and choir.** Its
  official recording is the National Theatre's 2008 session under Jiří
  Bělohlávek, and Commons carries three public-domain takes from it. Calling the
  chorus a "solo vocal" would have been wrong, so the split noted when the type
  was renamed happened here: 🎤 is one singer, **👥 is a choir**. Czechia has
  both — Adam Plachetka's solo take on 🎤, the chorus on 👥 — and is so far the
  only country with 👥, joining the United States and Switzerland on 🎤.

  A new rendering costs little: the sound path is already `/sound/<type>/<code>`,
  so `choral` brought its own folder, an `anthem.hasChoral` flag beside
  `hasVocal`, and a label in the eight interface languages.

  The 🎼 melody comes from the [public-domain MIDI on Wikimedia
  Commons](https://commons.wikimedia.org/wiki/File:Kde_domov_m%C5%AFj.mid), whose
  melody track holds two interleaved voices — the score is the top note at each
  onset, transposed E → E♭ to match the recording, 65.5 beats over the sixteen
  bars the anthem is written in. No intro: the recording opens on the melody.

  Škroup died 1862 and Tyl 1856, so the words are public domain, and Czechia is
  the third country to carry them. Only the first of the song's two stanzas —
  § 7 of the act adopting the anthem says the anthem *is* that stanza.

  `tools/fetch-lyrics.py` is back, rebuilt around an allowlist instead of the
  blocklist the README had been describing to a script that was no longer in the
  repo. A country it has not been told about is refused, and adding one means
  recording the author's death year, so the reasoning is in the file rather than
  in someone's memory. It also checks the stanza count, which is what catches a
  source page holding a whole poem where the anthem is one verse

- **Greek in Numbers**, 0–15 with its seventeen recordings — sixteen digits plus
  the language-name sound played when you switch to it. Unlike Week, the words
  had to be written: Numbers keys its names by *spoken* language, so nothing was
  there to reuse.

  The neuter forms, which is what Greek counts aloud with — ένα, τρία, τέσσερα
  rather than ένας, τρεις, τέσσερις — and the standard spellings for seven, eight
  and nine (επτά, οκτώ, εννέα) over the colloquial εφτά, οχτώ, εννιά

- **Greek and Turkish are spoken in Week**, taking it from six sound languages
  to eight. Neither needed a translation: Week keys its day names by *interface*
  language, and both have been interface languages all along, so Κυριακή and
  Pazar were already written for every day — only the fourteen recordings were
  missing. Athina and Emel, the voices the sister apps already use.

  That leaves Thai and Simplified Chinese in the same position: names written,
  no audio

- **Hebrew is Week's ninth interface language**, and the week reads
  right-to-left in it. Hebrew was already a *sound* language with a name for
  every day, but could not be selected as the interface, so its `rtl` flag had
  nothing to act on.

  Direction follows the interface language rather than the sound language,
  because the cards are written in the interface language — flipping the board
  for a Hebrew *sound* while the cards still read "Sunday" would lay English
  text out right-to-left. So `?l=he` gives an RTL week with יום ראשון on the
  right, while `?l=en&s=he` stays left-to-right and merely speaks Hebrew.

  This also removes a dead `rtl` field from Week's `LANGUAGE_DEFS`: it was set on
  Arabic and read by nothing, since the only consumer looks at `UI_LANGUAGES`.
  Hebrew missing it there looked like an oversight and was really a symptom

### Changed

- **Colors' codes now name a step on a ladder rather than a CSS shorthand.** A
  code is still three digits, one per channel, but each digit is expanded by
  `cssColor` instead of by the browser:

  | digit | `0` | `4` | `8` | `c` | `f` |
  | --- | --- | --- | --- | --- | --- |
  | channel | `00` | `40` | `80` | `BF` | `FF` |

  CSS's own shorthand repeats each digit, so it can only reach `00`, `44`, `88`,
  `CC`, `FF`. Half intensity came out as `77` (119) rather than `80` (128), which
  is why grey was `#777777` and read faintly warm, and why violet could only
  approximate the `#8000FF` it was asked for. The palette now hits violet and
  purple exactly, and lands teal and grey on the CSS-named `#008080` and
  `#808080`.

  Seven codes change to say the same thing on the new ladder — `077`→`088`,
  `707`→`808`, `70f`→`80f`, `730`→`840`, `777`→`888`, `f70`→`f80`, `f7b`→`f8c` —
  and the other eight are untouched, being made only of `0` and `f`. The colours
  themselves shift by 9 to 13 out of 255 where a `7` or `3` was involved, which is
  not visible side by side.

  Those seven codes are the URL value, the sound file name and the settings key at
  once, so a link naming one of them stops matching. Because an unusable parameter
  is ignored rather than applied, `?i=707` opens the full palette rather than a
  broken one, and saved hidden-colour and random-order entries fall back to
  defaults the same way

- **Apps import the shared packages directly, and import blocks are grouped.**
  Extracting `packages/` in 0.19.0 left a one-line re-export at each old path so
  that existing `from './useGame'` imports kept working. That was scaffolding for
  the move, and it outlived the move: fifteen files — `featureFlags.ts`,
  `useGame.ts` and `useFitText.ts`, byte-identical across all five apps — whose
  only content was a re-export. Both routes to the same code were in use, so
  reading an import no longer told you whether it led to app code or shared code.
  They are gone; imports now name the package.

  `audioCache.ts` stays, because it is not a re-export: it passes a per-app
  database name, so one app's 🗑️ cannot clear another's sounds on localhost.

  Import blocks are now ordered stylesheet, external, `@sawt/*`, local, with a
  blank line between groups — previously the workspace packages sat interleaved
  among the local imports in every app

- **Arabic numbers are one voice again, and ten finally says ʿasharah.** The whole
  0–15 run is regenerated with Edge's Hamed — Saudi, formal MSA, the voice Flags
  already uses for country names — replacing the ttsfree recordings for 0–10 and
  the Syrian voice used for 11–12, so the speaker no longer changes part-way
  through counting.

  Ten needed more than a new voice. A final ة is silent in Arabic pause position,
  so عشرة was read as its bare stem ʿashr — masculine to the ear, in the one place
  the number's gender is the whole point. It is now synthesized from عَشَرَةَ while
  the screen still shows عشرة, the same label-versus-pronunciation split Flags uses
  for جَبَل طَارِق. `tools/regen-audio.py` records the voice and that override, and
  reads the words from `src/digits/` so the audio cannot drift from the labels.

  Do not try to verify these files with a checksum: Edge is not deterministic and
  returns a different recording for the same text on every call

- **Colors' purple swatch was named after violet in three languages, and is not violet.**
  It held بنفسجي, Фіолетовий and סגול — each of which names `#8000FF`, a
  blue-leaning spectral violet the palette did not contain until violet was added.
  This swatch is `#800080`, non-spectral purple, so it now reads أرجواني, Пурпуровий and ארגמן,
  and the violet words moved to the swatch they describe. The five affected
  recordings were redone, since a label that disagrees with its sound would break
  the guessing game in exactly those languages.

  German and Swedish were already right and are unchanged: *Lila* is what anyone
  calls `#800080`, while *Purpur* is redder and more literary, and *Violett* was
  free for violet without moving anything. English "purple" simply spans both, which is
  why the mismatch went unnoticed — it is only visible from the other five
  languages. Found while checking what to call magenta, which is a third colour
  again

- **The browser's languages now decide the interface language only, and nothing
  starts hidden.** Week, Numbers, Flags and Colors used to read
  `navigator.languages` and hide every spoken language not in it. A visitor whose
  browser said `en-US` opened Numbers with ten of its eleven languages hidden —
  the app arriving mostly switched off, with no hint that there was more behind
  the settings panel. That is exactly backwards: a browser language list says
  which languages someone *reads*, which is a fair guess for the interface and a
  poor one for what they came to hear. Someone learning Arabic keeps their
  browser in Swedish.

  So the browser is matched against the interface languages only — its primary
  language, then the rest of its list, then English — and every spoken language is
  visible from the first visit. The selected sound follows the interface language
  when we have sounds for it (Swedish interface, Swedish sound) and falls back to
  English otherwise, so a Thai or Greek interface starts on English rather than
  something arbitrary. `preferredLanguage` is renamed `preferredSound` to say what
  it now picks.

  Anthem needed no change and is why the shape was already known to work: its
  sound is a *rendering* (🎺 instrument, 🎤 vocal, 🎼 notes, 🥁 intro), not a
  language, so it never had a spoken-language list for the browser to filter. It
  also lacked a fourth fallback step the other four carried, in which
  `preferredUiLanguage` consulted the *sound* list before settling on English —
  now removed, since it would otherwise have recursed through the new
  `preferredSound`

- **Renamed the sort modes to `code` / `name` / `random` everywhere.** Flags
  spelled by-code `iso` and Colors `code`, and both called the name sort `lang`.
  That last name was wrong in two ways: it says "language" when it means "the
  name the app displays", and that name comes from a different axis per app —
  Flags and Colors key their item names by *spoken* language, while Anthem keys
  them by *interface* language and has no per-sound names at all, since its sound
  is a rendering rather than a language. `name` is honest in all three, and each
  app binds it to whichever name it shows

- **Renamed and unified the URL parameters.** They were `f` for countries in both
  Flags and Anthem, `c` for colours, and `l` for the *content* language in four
  apps. `l` now means the *interface* language and `s` carries the sound, so an
  older `?l=en,ar` link sets the interface language instead of the spoken one

- Restructure the numbers app to match its siblings. It was transposed: one file
  per *language* (`src/lang/ar.ts` and so on) each holding a `numbers: string[]`,
  while the digits themselves had no files at all — they were a one-line `.map()`
  in `App.tsx`. Every other app has one file per *item* with the names keyed by
  language.

  There are now thirteen `src/digits/0.ts`…`12.ts`, each a `Digit` with
  `name: Record<Language, string>`, and the spoken languages live in a
  `LANGUAGE_DEFS` array in `App.tsx` exactly as they do in Week, Flags and
  Colors. `ALL_LANGUAGES` no longer means "the items on screen" here and "the
  language axis" everywhere else.

  All 143 words were moved by script and diffed against the originals, so none
  was retyped.

### Fixed

- **On a narrow screen the display clipped its own text, top and bottom.** Once
  the app bar stacked, the spelled-out name lost its ascenders and descenders —
  most visibly in Greek, where δεκατρία has both.

  The stacking rule that gives the display its own full-width row was written
  correctly but placed *before* the `.display` rule it overrides. Equal
  specificity, so source order decided and the base `flex: 1 1 0` won. In a
  column flex container that basis of zero left the display whatever height the
  toolbar had not taken — thirteen pixels for thirty-eight pixels of text,
  centred, so it was cut symmetrically at both ends.

  Moving the media query after the rule fixes it in all five apps, with a comment
  saying why it has to stay there. Verified across the breakpoint at 320, 375,
  480, 700, 759, 761, 900 and 1200 px, in both learn and game mode

- **A mistyped share link could permanently blank an app.** `?f=typo` matched no
  country, so every country was hidden — an empty board with no explanation — and
  because the parameter was merged into the settings object, the next settings
  change wrote that state to localStorage. The app then stayed empty even with the
  parameter removed, until the visitor cleared their site data. Parameters are now
  validated, and one with nothing usable left is ignored

- `sortByCodeOrName` still tested `mode === 'lang'` after the rename. Because
  `mode` is a plain string — deliberately, since it comes from a stored setting —
  TypeScript could not catch it, and the name sort would have silently fallen back
  to code order in both apps. It now accepts `name`, and keeps `lang` as the
  pre-0.20.0 spelling so an existing saved preference is not quietly downgraded

- Move each app's selected-sound `useState` above the effect that reads the URL.
  It was declared below and set from inside, which `react-hooks/immutability`
  flags as accessing a variable before it is declared — three of those errors
  pre-dated this change

## [0.19.0] 2026-08-04
### Added
- `packages/audio-cache` (`@sawt/audio-cache`) — the first shared package. The
  IndexedDB sound cache existed as five near-identical copies of the same 107
  lines; it is now one module, and each app holds a 17-line file naming its own
  database. 535 lines of duplication become 207
- `packages/feature-flags` (`@sawt/feature-flags`) — the `beta: true` gate that
  hides unfinished items from production builds. Three copies whose code was
  byte-identical; only the comment differed, naming a colour, a country or a
  language depending on which app it had been pasted into
- `packages/ui` (`@sawt/ui`) — the game HUD (`GameScore`, `GameActions`) and the
  shrink-to-fit `useFitText` hook, both byte-identical across all five apps
- The landing page shows the repository version in its footer
- `packages/game` (`@sawt/game`) — the game-mode state machine (`useGame`, 231
  lines) and the app-bar segments it drives (`GameScore`, `GameActions`, moved
  here from `@sawt/ui`, which now holds only the generic `useFitText`). `useGame`
  is generic over the prompt type: most apps prompt with a sound-file url, while
  Anthem prompts with a clip that may be a url, a start/end window into a longer
  recording, or a score synthesized live with no file at all. An optional
  `urlsOf` says which files a prompt needs cached, defaulting to the prompt
  itself when it is a url and letting Anthem return none for a score
- `packages/order` (`@sawt/order`) — board ordering: `shuffle` (three verbatim
  copies) and `sortByCodeOrName`, which replaces Flags' `sortCountries` and
  Colors' `sortColors`. Those two had identical fourteen-line bodies differing
  only in a type name. It takes the name through an accessor rather than a shared
  item shape, because each app's `name` is `Record<Language, string>` over its
  own language union and cannot satisfy a common constraint — and it treats the
  by-code mode as the default branch, since Flags spells it `iso` and Colors
  `code`

  Each app keeps a two- or three-line re-export at the old path, so every
  existing `from './GameHud'` / `'./featureFlags'` / `'./useFitText'` import is
  untouched. `index.tsx` is deliberately **not** shared: it imports `./App` and
  `./index.css`, and is the entry point named in each `index.html`

### Fixed
- **Anthem was writing its cached sounds to a database called `flags-audio`.**
  Its `audioCache.ts` was copied from Flags and the name never changed, so
  during development — where every app runs on localhost and therefore shares an
  origin — Anthem and Flags shared one cache: the 🔊 count showed the other
  app's files and 🗑️ cleared them. In production the apps sit on separate
  subdomains, so they were separate origins and never actually collided. Anthem
  now uses `anthem-audio`, which means its visitors re-download their cached
  anthems once

### Changed
- Lint and typecheck now cover `packages/` as well as `apps/`, and the root
  `build` script skips workspaces with nothing to build (packages ship
  TypeScript source, which Vite transpiles — there is no build step)

## [0.18.0] 2026-08-03
### Added
- **Bring the five learning apps together in one npm workspace.** Week, Flags,
  Colors, Numbers and Anthem each lived in their own repository; they now sit
  side by side in `apps/`, sharing one install and one toolchain. A single
  `node_modules` at the root serves every app: ~63 MB, against ~325 MB when the
  five were separate checkouts
- A landing page (`apps/home`) for www.sawt.info, with a button per app linking
  to its subdomain. Each button carries that app's own favicon, so the mark on
  the button matches the browser tab after you arrive
- ESLint at the workspace root — one flat config for every app, with
  `npm run lint` and `npm run lint:fix`. It enforces the existing house style
  (tabs, single quotes, no semicolons) rather than imposing a new one, and adds
  `react-hooks` correctness checks on top of `typescript-eslint`

### Changed
- **One version for the whole repository.** The apps previously versioned
  independently, which made sense as five repositories and stopped making sense
  as one. Everything moved to a shared number, including the landing page and
  the workspace root
- Rename Arqaam to Numbers, matching the sister projects' plain English names:
  the folder is `apps/numbers`, the package is `numbers`, and it deploys to
  numbers.sawt.info. The localStorage key (`numbers:settings`) and the IndexedDB
  cache (`numbers-audio`) are renamed with it, so a visitor's saved settings and
  cached sounds start fresh — no migration needed, since the new subdomain is a
  different origin anyway

### Fixed
- `useGame` read a ref and called `Date.now()` during render
  (`elapsedMs: (endedAt ?? Date.now()) - roundStart.current`), which React 19
  flags as unsafe: a render that reads a ref produces a value React does not
  know to re-render for. The second-tick `useState` that already existed as a
  dummy counter now holds the clock value itself, so `elapsedMs` is a pure read
  of state. Fixed in all five apps
- Delete a stale 2.8 MB Create React App build that had been sitting in the
  numbers app since before its move to Vite. It was gitignored where it came
  from, so it never reached a commit — but it accounted for 832 of the 1109
  problems the first ESLint run reported
- Correct the root `.gitignore`: `/build` is anchored to the repository root and
  would not have caught an app-level `build/`
- Convert the last Create React App leftovers to the house style. Every
  `index.tsx`, every `reportWebVitals.ts` and the numbers app's `src/lang/*.ts`
  were still on two-space indentation with semicolons
- Correct each app's README, which had drifted from the code over the previous
  cycle:
  - all five described ✋ stop and 🔄 restart as separate buttons; they were
    merged into one ⏹️/▶️ control in 0.17.0
  - week described two language dropdowns (👁️ display and 🗣️ sound); there is
    one sound dropdown, and the card faces follow the interface language
  - flags listed 30 countries against 45, still documented the removed 🎺 anthem
    option, and credited the Arabic voice as Amany after the set was re-recorded
    with Hamed
  - numbers said "zero to ten" when it goes to twelve, and its version badge
    pointed at the old 0.16.0 branch
  - colors was missing Ukrainian and Hebrew from its language list
  - anthem listed 10 countries against 14 live plus 19 beta, called 🎤 "Vocal"
    rather than "Solo vocal", and named six interface languages instead of eight

### Removed
- The five original repositories are archived and read-only. They keep the
  history up to the move; each carries a notice pointing here
