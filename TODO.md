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

- **Ask baab for a code in the interface's language** — today the sheet
  sends `POST /v1/login` with `{ email, app }` alone, so the code and the
  magic link arrive in English whatever language the app is showing. The
  request should carry the interface language too (`lang`: `en`, `ar`,
  `de`, `el`, `sv`, `th`, `tr`, `zh`, and Week's `he`), so baab writes the
  mail in it — for a first sign-in that makes the account as for a
  returning one, and the same for every code baab sends: the sudo code that
  will guard deleting the account (`POST /v1/sudo`, baab 0.5.0), and an SMS
  code once phone sign-in exists. `useBaab`'s `knock` and the sheet take
  the language from the app the way the sheet already takes `t` and `dir`;
  the landing page sends `en`. Needs baab to accept the field and to write
  its mail in those languages — in baab's TODO — and until it does, baab
  should ignore a `lang` it does not know rather than refuse the request,
  so the apps can send it first.
