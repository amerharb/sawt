# TODO — Flag and Map content roadmap

- **Recordings beyond English** — a hundred and sixty-two entries are
  English-only (`sounds: ['en']`); each needs its name recorded in the other
  nine sound languages: Arabic, German, Swedish, Danish, Albanian,
  Portuguese, Turkish, Persian and Ukrainian. Roughly 1,400 recordings, best
  done language by language.
- **The interface-only languages** — Greek, Thai and Chinese names are
  display-only today; making any of them a sound language means recording
  every country and adding the code to `SoundLanguage` in Map's
  `src/languages.ts` (TypeScript will then point out every gap).
- **Eight islands are beta in Map** — Kiribati, Micronesia, Tonga, São Tomé
  and Príncipe, Cape Verde, Comoros, Samoa and Mauritius. Each is drawn as
  parts too small to see or click at world scale. São Tomé, Comoros,
  Mauritius and Samoa are compact enough for a single `MARKERS` dot today;
  the other four are spread across too much ocean for one dot to be honest,
  and need either multi-dot marker support or a finer atlas. They stay live
  in Flag, where a card is a card.
