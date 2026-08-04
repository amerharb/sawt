# Anthem Changelog

<!-- https://keepachangelog.com/en/1.0.0/ -->

> [!NOTE]
> This changelog covers the years Anthem spent as its own repository, up to
> 0.17.0. It is frozen here — from 0.18.0 onwards the whole workspace shares
> [one changelog at the repository root](../../CHANGELOG.md).

## [0.17.0] 2026-08-03
### Fixed
- Correct the README: regenerate the country list from the data (14 live, 19
  beta), rename 🎤 to Solo vocal, list all eight interface languages, and
  document `public/lyrics/` and `tools/fetch-lyrics.py`
### Added
- Promote Switzerland 🇨🇭 out of beta, with no intro (pitched music starts at
  full volume; the 0.5 s dip at 5.4 s is smaller than the later phrase breaks),
  a 🎼 melody from the public-domain four-voice MIDI on Wikimedia Commons, and
  a 🎤 vocal from the public-domain official recording. The MIDI is arranged in
  A and the recording is in E♭ — a tritone apart — so the melody is transposed
  down. The vocal source runs 394 s, so it is cut at the 90.1 s section break
  to sit alongside the 84 s instrumental
- Promote Belgium 🇧🇪 out of beta, with a 4.4 s drum-roll intro (unpitched until
  ~4.1 s, when the band enters) and a 🎼 melody from the monophonic `trumpet(s)`
  line of a BitMidi band arrangement. Its pitch classes match the published
  voice line, which is how the notes were checked. Kept in the anthem's written
  B♭ rather than transposed to the recording's F. No 🎤 vocal: the three sung
  versions on Commons (French, Dutch, Walloon) are CC BY, and the project stays
  public-domain-only
### Changed
- Rename the 🎤 option from "Vocal" to "Solo vocal" in all eight interface
  languages: both recordings so far (US, Switzerland) are solo vocalists, and
  choral and other kinds will get their own types later. The internal type id
  stays `vocal` until that split happens
- Take the 🎼 Notes option out of beta — it now shows in production, where 10 of
  the 13 countries have a score behind it
- Promote Austria 🇦🇹 out of beta, with a 4.4 s intro (a quiet sustained tone,
  then 1.2 s of silence before the anthem enters) and a 🎼 melody taken from the
  CC0 four-voice MIDI on Wikimedia Commons — the first score derived from a
  freely-licensed MIDI rather than a scan. The arrangement is in D and the
  recording in F, so it is transposed up a minor third; the tempo (63) is
  measured from the recording's phrases, not the MIDI's own 110. No 🎤 vocal:
  all four Austrian recordings on Commons are instrumental, though the lyrics
  themselves entered the public domain in 2022
- Add the first 🎤 vocal recording: the United States, sung by a solo vocalist
  with the U.S. Navy Band (public domain as a work of the U.S. government) —
  the same ensemble family as the instrumental already in place. The 🎤 option
  had been in the UI with no country behind it; it stays beta while it is the
  only one
- Promote Albania 🇦🇱 out of beta, the first of the bulk-added countries to be
  worked through: its recording is three straight statements of the tune (seams
  at 10.7 / 21.1 / 41.7 s), so it has no distinct intro, and it now carries its
  composed and adopted dates. No 🎤 vocal — the only public-domain recording is
  a 1918 acoustic disc, too rough to ship — and no 🎼 score, the melody derived
  from the published voice line did not hold up by ear
- Add Simplified Chinese (简体中文) as an interface language, bringing every
  sister project to the same eight: English, Arabic, German, Greek, Swedish,
  Thai, Turkish and Simplified Chinese
  All 33 country names are translated with it
- Add German (Deutsch) as an interface language, bringing the project to the
  same seven as its sister projects: English, Arabic, German, Greek, Swedish,
  Thai and Turkish. All 33 country names are translated with it
- Add 23 more countries from the Flags project (Albania, Austria, Belgium,
  Switzerland, Czech Republic, Germany, Denmark, Egypt, Spain, France, United
  Kingdom, Hungary, Iran, Italy, Luxembourg, Netherlands, Norway, Poland,
  Palestine, Portugal, Tunisia, Ukraine and Vatican City) with their anthem
  recordings, as **beta** — their intro points and 🎼 melodies are still to do
- Two new round sounds: a rising fanfare when a round is played to the end, and
  a softer two-tone when the player ends it early with ⏹️
- Keep a result per finished round while game mode is on — `{ solved, total,
  elapsedMs, mistakes, giveUps, mode }`, where `mode` records which
  language/anthem type it was played in. A round that ran to the end is simply
  one where `solved === total`. The list is cleared on leaving game mode
### Changed
- Merge the ✋ stop and 🔄 restart buttons into one media-style control: it shows
  ⏹️ while a round is running and ▶️ once it has ended, so the same spot always
  stops or starts

## [0.16.0] 2026-07-30
### Added
- Initial release, split out from the Flags project: an app focused on national
  anthems only. Countries: United Arab Emirates 🇦🇪, Greece 🇬🇷, Iraq 🇮🇶,
  Lebanon 🇱🇧, Oman 🇴🇲, Sweden 🇸🇪, Syria 🇸🇾, Thailand 🇹🇭, Turkey 🇹🇷 and the
  United States 🇺🇸
- Choose the anthem type from the toolbar dropdown — 🎺 Instrument (recorded
  performance), 🎤 Vocal (sung in the country's native language), 🎼 Notes (the
  melody synthesized live in the browser from stored notes), 🥁 Intro (the
  anthem's own drum/instrumental intro) and 🥁🎺 Intro + Instrument (both, back to
  back). This replaces the old `xa`/`xt` pseudo-language codes from Flags
- A country that lacks the selected type is shown **disabled** rather than
  hidden, so the board stays stable while switching types. Availability comes
  from the country data (`anthem.intro`, `anthem.hasVocal`)
- One recording per country serves all three instrumental renderings: the
  country file records where the intro ends (`anthem.intro`, in seconds) and
  playback windows into `anthem/<code>.aac` — 🥁 plays 0 → intro, 🎺 plays
  intro → end, 🥁🎺 plays the whole file. No split or stitched files, so a
  country needs one third of the audio and the 🥁🎺 join is the original
  recording (seamless by construction)
- Each card shows either the country's flag or its name — a toggle in the
  settings panel (🏳️ flag / 🔤 name)
- Interface localized in English, Arabic, Greek, Swedish, Thai and Turkish (👁️
  dropdown in settings), following the browser language on first run; Arabic lays
  the cards out right-to-left. Country names are translated into all six
- Guessing game (🕹️): a random country's anthem plays and you tap the matching
  card, with live score, give-up (🤷‍♂️) and round controls (👂 ✋ 🔄), shared
  with the sister apps
- Theme (system / light / dark), flight-mode offline caching (✈️) of the visible
  anthems, and a `?f=` URL parameter to preset which countries are shown
- Bundle a `flags` webfont (`public/flags.woff2`) and use it wherever a country
  flag emoji is shown (the card faces in Flag display mode and the settings flag
  grid), so flags render on platforms whose OS lacks flag-emoji glyphs (e.g.
  Windows/Chromium), with the platform emoji fonts as fallback
- Built on the shared architecture of the sister apps (Vite, React 19,
  TypeScript 6): `useAudio`, `useGame`, `GameHud`, `useFitText`, the IndexedDB
  audio cache and the i18n helper
