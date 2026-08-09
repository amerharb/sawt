# MIDI sources

The MIDI files each country's `anthem.score` melody was transcribed from. They
are **source material, not runtime assets** — the app ships only the note text in
`src/countries/<code>.ts` and never loads these files, so they stay out of
`public/`.

Keeping them here means a score can always be re-derived or checked against
where it came from.

| File | Anthem | Source | Notes |
| --- | --- | --- | --- |
| `us.midi` | The Star-Spangled Banner | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:2_Star_Spangled_Banner.mid) — public domain | piano arrangement; the melody is the top voice |
| `sy.midi` | حماة الديار (Homat el Diyar) | [BitMidi](https://bitmidi.com/national-anthem-syria-mid) | `MELODY` track; cross-checked against the published score |
| `lb.midi` | كلنا للوطن | BitMidi `/uploads/79438.mid` | `MELODY` track; anthem unchanged since 1927 |
| `ae.midi` | عيشي بلادي | BitMidi `/uploads/79487.mid` | `MELODY` track; anthem music unchanged since 1971 |
| `om.midi` | السلام السلطاني | BitMidi `/uploads/79452.mid` | `MELODY` track; **predates Oman's 1996 revision** — verify before trusting |
| `th.midi` | เพลงชาติไทย | BitMidi `/uploads/79481.mid` | `MELODY` track; anthem unchanged since 1939 |
| `tr.midi` | İstiklal Marşı | BitMidi `/uploads/79483.mid` | `MELODY` track; anthem dates from 1921 |
| `gr.midi` | Ύμνος εις την Ελευθερίαν | BitMidi `/uploads/79430.mid` | `MELODY` track, transposed down an octave (source is in the piccolo register) |
| `cz.midi` | Kde domov můj | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Kde_domov_m%C5%AFj.mid) — public domain (PD Czech official) | track 1 holds two interleaved voices; the score is the top note per onset, transposed E → E♭ to match the recording |
| `de.midi` | Das Lied der Deutschen | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Gotterhalte.mid) — public domain | Haydn's Kaiserhymne. One format-0 track ten voices deep with no melody line; the score is the highest voice sounding above C4. **Unconfirmed** — the CC0 `Einigkeit und Recht.mid` diverges by the third note |
| `dk.midi` | Der er et yndigt land | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Der_er_et_yndigt_land.mid) — CC BY-SA 2.5, **not committed** | monophonic, 83 notes, no extraction needed. Transposed D → F |
| `es.midi` | La Marcha Real | BitMidi `/uploads/79470.mid`, **not committed** | `trumpet(s)` track, transposed C → B♭. The file is a longer arrangement (199 beats); the score is the 47.5 beats after the intro, ending on the tonic. Key and tempo confirmed against [BOE núm. 244, 1997](https://commons.wikimedia.org/wiki/File:Partitura_Marcha_Real_(Extracto).jpg) — two flats, Maestoso ♩=76. Spain's anthem was unchanged in 1991, so the World Atlas caveat does not bite |
| `eg.midi` | بلادي بلادي بلادي | BitMidi `/uploads/42750.mid`, **not committed** | `trumpet(s)` track, already in F major — no transposition. Cross-checked against a published melody sheet: same key, same 2/4, and the sheet's first/second endings match the repeat already in the file. Anthem adopted 1979, so a 1991 file is correct |
| `fr.midi` | La Marseillaise | BitMidi `/uploads/35150.mid`, **not committed** | piano arrangement, poly 5; the score is the highest voice above D4. In G, transposed up a semitone to the Navy Band recording's A♭. Plays the anthem twice, so only the first 123.5 beats are kept. **The one score needing no second source** — it opens "Allons enfants de la patrie" note for note, which was predictable before looking |
| `gb.midi` | God Save the King | BitMidi `/uploads/35076.mid`, **not committed** | piano arrangement, poly 4; the score is the highest voice above D4. In G, transposed up a minor third to the Navy Band recording's B♭, where it comes out fully diatonic. Plays the tune twice, so only the first 42 beats — fourteen bars of 3/4 — are kept. **The second score needing no corroborating source**: it opens G-G-A-F♯-G-A-B, "God save our gra-cious King" note for note, which was predictable before extracting it |
| `at.midi` | Land der Berge, Land am Strome | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Land_der_Berge,_Land_am_Strome.mid) — **CC0** | four-voice setting by Rabanus Flavus; melody is track 1's soprano (highest note per onset — it doubles into octaves late). Arranged in D, transposed up a minor third to F |
| `be.midi` | La Brabançonne | BitMidi `/uploads/16903.mid` | no `MELODY` track — the melody is the monophonic `trumpet(s)` line, like Sweden. Its pitch classes (Bb C D Eb F G A) match the published voice line, which is how the notes were checked |
| `ch.midi` | Schweizerpsalm | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Trittst_im_Morgenrot_daher.mid) — **public domain** | four voices; track 1 is already monophonic (152 notes, no chords). Arranged in A, transposed down a tritone to the recording's Eb |
| `se.midi` | Du gamla, du fria | BitMidi `/uploads/79476.mid` | no `MELODY` track — the melody is the monophonic `trumpet(s)` line |

`at.midi`, `ch.midi` and `us.midi` are the ones that do not come from BitMidi; `at.midi`
is a CC0 dedication and `ch.midi` is public domain, so unlike the others they
are safe to redistribute.

All the BitMidi files above come from the same Software Toolworks *World
Atlas* (1991) collection. Always check what the anthem **was in 1991** before
transcribing from it — that is exactly how Iraq's file turned out to be the wrong
anthem (see below).

For Syria the melody was also checked against the printed score (Mohammad and
Ahmad Salim Flayfel, A major, 4/4, quarter = 100), available from
[Cantorion](https://cantorion.org/music/3858/Guardians-of-the-Homeland-(Homat-el-Diyar)-Voice-Piano).

## Scores not derived from MIDI

Not every melody starts as a MIDI file, so there is nothing to keep in this folder
for these. They are recorded here anyway, because this file is where a score's
provenance is looked up.

| Anthem | Source | Notes |
| --- | --- | --- |
| Himnusz (Hungary) | the `<score>` block on [en.wikipedia](https://en.wikipedia.org/wiki/Himnusz), a four-part LilyPond setting taken from [IMSLP 306865](https://imslp.org/wiki/Special:ImagefromIndex/306865/nhdyq) — public domain | Written in E♭; the melody is the soprano, transposed down two semitones to the recording's D♭. Parses to exactly 64.00 beats — sixteen bars of 4/4 — which is its own check that the relative-octave parse is right. **The best-corroborated score here**: the Commons engraving [`Himnusz kottája.png`](https://commons.wikimedia.org/wiki/File:Himnusz_kott%C3%A1ja.png) is in B♭ and opens D4 E♭4 F4 B♭4, the same tune a fourth lower; the −2 transposition was measured rather than chosen, every best alignment of score against recording landing on it independently; and the one chromatic note, A4, is the single sharp the engraving shows, at "a-kit ré-gen tép" |

Text notation beats a MIDI file where it exists — there is no melody line to guess
at and no arranger's octave doublings to see through. Worth looking for a
`<score>` block on Wikipedia before reaching for BitMidi.

## How a score is derived

1. Parse the MIDI and find the melody: a track named `MELODY`, or the highest
   note at each onset when the arrangement is a single polyphonic track.
2. Take each note's length as the time to the **next** onset (so the melody is
   legato), and quantize to sensible note values. A gap much longer than the
   note's own sounding length becomes a rest.
3. Write the result as `<note><octave>/<beats>` tokens — see `src/synth.ts`.

Do not transcribe from a pure-tone rendering: the ones this project started with
(the old `xt`/tonal files, since removed) had wrong pitches and no rhythm at all.

## Licensing

`us.midi` is public domain (Wikimedia Commons) and is committed here.

Every other file here (`sy` `lb` `ae` `om` `th` `tr` `gr` `se` `be` `dk` `es` `eg` `fr` `gb`) is **not committed** — they are
listed in `.gitignore`. They carry "(p) (c) The Software Toolworks 1991" in their
metadata, so they are someone else's copyrighted arrangements; redistributing
them from a public repo is not ours to do. They stay on disk locally for
reference, and the table above records where to get them again. What ships is
only the melodies transcribed from them, in `src/countries/*.ts`.

Note that the underlying compositions are a separate question from the MIDI
files: several anthem melodies here are 20th-century works still in copyright in
many countries (Syria's and Iraq's are both by Mohammed Flayfel, d. 1986). They
are used here for education, credited, and can be removed on request.

## Not yet sourced

**Iraq (موطني / Mawtini).** Still missing, and the obvious candidate is a trap:
every MIDI found under "National Anthem – Iraq" comes from the same Software
Toolworks *World Atlas* 1991 collection, and in 1991 Iraq's anthem was
أرض الفراتين (Ardh Alforatain, 1981–2003) — **not** Mawtini, which was only
adopted in 2004. Using it would put the wrong anthem in the app.

Checked and came up empty: Wikimedia Commons (no notation for Mawtini),
Wikipedia in six languages (no `<score>`/LilyPond block), Cantorion (no entry),
nationalanthems.info (no score file), MuseScore (blocks automated download),
ScoreExchange (its "preview" is only the flag image). Extracting the melody from
`public/sound/anthem/iq.aac` also failed — the orchestral texture makes the
pitch tracker follow harmonics and accompaniment instead of the tune.

What would work: a MusicXML/MIDI of Mawtini, or any legible sheet music (PDF or
image) — reading notation from a rendered score is how Syria's key, metre and
tempo were confirmed.
