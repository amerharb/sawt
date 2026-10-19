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

- **Let an account change its mail language** — since 0.51.0 a sign-in
  sends the interface language first and the browser's list after it
  (`languages` on `POST /v1/login`), and baab (≥ 0.5.0) makes the first one
  it supports a new account's mail language. An existing account keeps
  its own, whatever language the app shows later. baab's `GET /v1/profile`
  shows it and `PUT /v1/profile` with `{ "language": "ar" }` changes it, so
  the sign-in sheet could offer the choice beside the nickname — from
  baab's list (`en`, `ar`, `de`, `sv` today), or by following the
  interface language when it changes. baab writes four languages so far;
  Greek, Thai, Turkish, Chinese and Week's Hebrew fall through the browser's
  list to English until baab learns them.
