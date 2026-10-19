# TODO — sawt

## Flag and Map content

- **Recordings beyond English, German, Swedish and Arabic** — a hundred and
  sixty-two entries speak those four only (`sounds: ['en', 'de', 'sv', 'ar']`;
  German, Swedish and Arabic landed as the first full batches); each still
  needs its name recorded in the other six sound languages: Danish, Albanian,
  Portuguese, Turkish, Persian and Ukrainian. Roughly 1,000 recordings, best
  done language by language.
- **The interface-only languages** — Greek, Thai and Chinese names are
  display-only today; making any of them a sound language means recording
  every country and adding the code to `SoundLanguage` in Map's
  `src/languages.ts` (TypeScript will then point out every gap).

## Sign-in

- **Mail in more languages** — the sheet's mail-language choice (0.51.0)
  offers what baab writes: English, Arabic, German and Swedish. Greek, Thai,
  Turkish, Chinese and Week's Hebrew wait for baab to learn them (baab's
  TODO, "More mail languages"); each then joins `MAIL_LANGUAGES` in
  `packages/game/src/baab.ts`, named in itself, and a new account's
  preference list already reaches it.
