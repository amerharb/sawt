# MIDI sources

The MIDI files each country's 🎼 melody was transcribed from. They
are **source material, not runtime assets** — the app ships only the note text in
`public/melody/<code>.txt` and never loads these files, so they stay out of
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
| `eg.midi` | بلادي بلادي بلادي | BitMidi `/uploads/42750.mid`, **not committed** — **no longer used**: the score now comes from the sheet on nationalanthems.info, below | `trumpet(s)` track, already in F major — no transposition. Cross-checked against a published melody sheet: same key, same 2/4, and the sheet's first/second endings match the repeat already in the file. Anthem adopted 1979, so a 1991 file is correct |
| `fr.midi` | La Marseillaise | BitMidi `/uploads/35150.mid`, **not committed** | piano arrangement, poly 5; the score is the highest voice above D4. In G, transposed up a semitone to the Navy Band recording's A♭. Plays the anthem twice, so only the first 123.5 beats are kept. **The one score needing no second source** — it opens "Allons enfants de la patrie" note for note, which was predictable before looking |
| `gb.midi` | God Save the King | BitMidi `/uploads/35076.mid`, **not committed** | piano arrangement, poly 4; the score is the highest voice above D4. In G, transposed up a minor third to the Navy Band recording's B♭, where it comes out fully diatonic. Plays the tune twice, so only the first 42 beats — fourteen bars of 3/4 — are kept. **The second score needing no corroborating source**: it opens G-G-A-F♯-G-A-B, "God save our gra-cious King" note for note, which was predictable before extracting it |
| `at.midi` | Land der Berge, Land am Strome | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Land_der_Berge,_Land_am_Strome.mid) — **CC0** | four-voice setting by Rabanus Flavus; melody is track 1's soprano (highest note per onset — it doubles into octaves late). Arranged in D, transposed up a minor third to F |
| `be.midi` | La Brabançonne | BitMidi `/uploads/16903.mid` | no `MELODY` track — the melody is the monophonic `trumpet(s)` line, like Sweden. Its pitch classes (Bb C D Eb F G A) match the published voice line, which is how the notes were checked |
| `lu.midi` | Ons Heemecht | BitMidi `/uploads/79441.mid` (World Atlas) | dedicated `Melody` track, 73 notes, polyphony 1 — no extraction needed. Arranged in E♭, transposed down a fourth to the recording's B♭, where all 73 notes are diatonic. Anthem music unchanged since 1864, so the 1991 atlas is safe |
| `ch.midi` | Schweizerpsalm | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Trittst_im_Morgenrot_daher.mid) — **public domain** | four voices; track 1 is already monophonic (152 notes, no chords). Arranged in A, transposed down a tritone to the recording's Eb |
| `se.midi` | Du gamla, du fria | BitMidi `/uploads/79476.mid` | no `MELODY` track — the melody is the monophonic `trumpet(s)` line |
| `in.midi` | Jana Gana Mana | BitMidi `/uploads/79431.mid` (World Atlas), **not committed** | dedicated `MELODY` track, 249 notes, monophonic throughout — no extraction needed, and **no transposition**: the U.S. Navy Band recording plays in the E♭ the file is written in, which five of the eleven notes held 1.5 beats or more confirm from their fundamentals. **The file holds more than the recording plays**: its melody runs 198 quarters and repeats a block near the end, while the score is notes 0–150, the anthem once, ending on the tonic. Tempo 107, measured from every ending between notes 130 and 144 — all agree on 107.00 and on the tune starting at 0.00 s, holding alignment across the piece to within 0.33 s, where past note 144 the drift jumps to 1.35 s |
| `lr.midi` | All Hail, Liberia, Hail! | BitMidi `/uploads/79440.mid` (World Atlas), **not committed** | no `MELODY` track, and **the tune moves between two tracks like the Vatican's**: `trumpet(s)` carries it but twice drops to a pedal — 18.6 beats from q45 and 15.2 from q69 — while `fr. horn(s)` takes over. The score is the trumpet with the horn filling those two, which fits better than the trumpet alone (r = 0.55 against 0.54) and avoids two nineteen-beat drones; the second passage is an interlude with no tune at all. Already in the recording's B♭, and **the best-measured key here** — five of the seven notes held two beats or more come back at exactly 0 semitones from their fundamentals. Onsets snapped to a sixteenth grid, so it parses to 130.0 beats against the file's 129.97. Liberia's anthem is unchanged since 1847 |
| `nz.midi` | God Defend New Zealand | BitMidi `/uploads/79447.mid` (World Atlas), **not committed** | no `MELODY` track — the melody is the `trumpet(s)` line, monophonic but for one overlap on the final chord, the same shape as Belgium's and Sweden's. 64 notes, 65 beats. Transposed up a semitone from G to the band's A♭, where all 64 come out diatonic; four of the eight notes held 1.5 beats or more measure that shift from their fundamentals. Tempo 68.75, a sharp peak. **One caveat**: the first three quarters align at 0.56–0.69 but the last does not (0.25 where the score puts it), and six seconds of the recording past 56.8 s match no phrase at any tempo — the band is doing something at the close the file does not have. New Zealand's anthem has been co-official since 1977, so a 1991 file is right |
| `pe.midi` | Himno Nacional del Perú | BitMidi `/uploads/79456.mid` (World Atlas), **not committed** | dedicated `Melody` track, 311 notes, monophonic throughout — no extraction needed. Already in the recording's key, so nothing was transposed. The file holds the whole anthem, chorus · verse · chorus; only the first chorus is kept, because that is all the recordings play — it matches at r = 0.73 where the verse scores 0.10. Cut at note 96: the closing phrase appears twice, notes 53–74 and 75–96, note-for-note identical and both resolving to F, which is its own check on where the chorus ends. Peru's anthem is unchanged since 1821, so a 1991 file is safe |
| `au.midi` | Advance Australia Fair | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Advance_Australia_Fair.mid) — public domain, set by Brian Yap from the 1907 first edition | four voices in C major, 4/4; the melody is track 1's soprano, 70 notes after a one-beat anacrusis. Transposed down two semitones to the recording's B♭, where all 70 come out diatonic. One transcription slip to see past: the E at bar 6 beat 3 carries a dotted-half length that overlaps the three notes after it, identically in all four parts — the onsets are right and the app takes each note's length from the next onset anyway. **No `<score>` block exists in any of the 82 Wikipedia editions of this article**, so the MIDI is the only machine-readable source |

`us.midi`, `cz.midi`, `de.midi`, `at.midi`, `ch.midi`, `dk.midi`, `au.midi` and `pk.midi`
are the ones that do not come from BitMidi — all eight from Wikimedia Commons. Six of
them are public domain or CC0 and so, unlike the BitMidi files, are safe to
redistribute; `dk.midi` is not, being CC BY-SA 2.5, and nor is `pk.midi`, CC BY 2.5.

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
| `ua.midi` | Ще не вмерла України | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Shche_ne_vmerla_Ukraina_(pg).mid) — CC0, sequenced by Peter Gerloff | Verbytsky's melody entire, 129 beats in E minor, ♩=97. Five tracks; `unbenannt4` (trumpet) is the melody alone and monophonic throughout, so nothing had to be merged or picked apart. Transposed up three semitones to the recording's G minor. **Committed**: CC0, and Verbytsky died in 1870 |
| `va.midi` | Inno e Marcia Pontificale | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Inno_pontificale.mid) — CC0, sequenced by Peter Gerloff | Gounod's march entire, 72 bars of 4/4 in D major, ♩=100. The tune moves between two of the five tracks — `unbenannt4` (horn) carries it except bars 25–32, which `unbenannt2` (trumpet) takes — so the score merges the two. Transposed up a semitone-and-a-tone to the recording's F major. **The first source here committed outright**: CC0, and Gounod died in 1893 |
| *(none)* | Mazurek Dąbrowskiego | the `<score>` block on [nb](https://no.wikipedia.org/wiki/Mazurek_Dąbrowskiego), [fr](https://fr.wikipedia.org/wiki/Mazurek_Dąbrowskiego) and seven more Wikipedia editions — LilyPond, identical in all of them | F major, 3/4, ♩=116, with the refrain under `\repeat volta 2`; unfolded it is 24 bars. **No file to keep**: the notation is text in the article and the tune is an anonymous 18th-century mazurka, so for once there was nothing to weigh |
| 义勇军进行曲 (China) | the `<score>` block on [en.wikipedia](https://en.wikipedia.org/wiki/March_of_the_Volunteers), identical on the Chinese, Japanese, Thai and Hungarian articles — public domain (Nie Er died 1935) | G major, 2/4; parses to 74.00 beats, exactly 37 bars, which is its own check. The score keeps the 62.5 beats after the introduction. **The intro came from the score, not the level**: the block's `\addlyrics` opens with twenty blank placeholders, so 起 falls on the twenty-second note at beat 11.5 — 6.67 s at 103.5 — and fitting the tune alone lands at 6.69 s independently. **The best-measured country here**: nothing transposed, and five of the six notes held two beats or more come back at exactly 0 semitones from their fundamentals (median +0.03), with alignment holding to within 0.09 s. **The first score with triplets**: `\times 2/3 {d'8 d d}` gives tokens of 0.3333. A scan of the official sheet corroborates key, metre and the wordless opening system, but the notes were not read from it |
| Indonesia Raya (Indonesia) | the `<score>` block on [id.wikipedia](https://id.wikipedia.org/wiki/Indonesia_Raya), set from the government songbook [*Brosur Lagu Kebangsaan — Indonesia Raya*](https://commons.wikimedia.org/wiki/File:Brosur_Lagu_Kebangsaan_-_Indonesia_Raya.pdf), p. 153 — public domain (Supratman died 1938) | G major, 4/4, one stanza and the refrain under `\repeat volta 2`; unfolded it is 40 bars and 160 beats, which is exactly what the recording plays. **The only score here needing neither transposition nor an adjusted tempo** — it is already in the recording's G, and its marked ♩=96 is what all three government recordings measure, to 96.00. The parse checks itself twice: 160.0 beats is a whole number of bars, and every note is diatonic in G. Key confirmed from fundamentals anyway — of the eleven notes held two beats or more, three come back at exactly 0 semitones and the rest all land on an octave, fifth or third of the G triad |
| Maamme / Vårt land (Finland) | the `<score>` block on [sv.wikipedia](https://sv.wikipedia.org/wiki/V%C3%A5rt_land), identical on [en.wikipedia](https://en.wikipedia.org/wiki/Maamme) — a LilyPond lead sheet marked *som i trycket*, as printed — public domain (Pacius died 1891) | A major, 3/4, ♩=84, one stanza of 36 beats with a three-quaver anacrusis. **Transposed up a semitone to the Navy Band's B♭**, measured from the recording: chroma correlation 0.49 at +1 against nothing above 0.08 elsewhere, and the held F and B♭ come back at exactly +1 from their fundamentals. **The repeat is the band's, not the block's**: the sheet gives the stanza once, the band plays it, holds the last note, breathes and plays lines 3–6 again — the way the anthem is sung — and that shape (61.5 beats) fits the tape note for note, the first pass from 0.5 s at 81.25 and the repeat from 28.9 s at 81.75. No file to keep: the notation is text in the article |
| `tn.midi` | حماة الحمى (Humat al-Hima) | [8notes voice line](https://www.8notes.com/scores/37816.asp) `school/midi/voice/tunisia_voice.mid`, **not committed** | `Voice` track in G major, 2/4, ♩=100; the file plays chorus twice, an eight-line stanza and the chorus twice. Transposed up a semitone to the recording's A♭ major, and cut to the form the recording plays — chorus, one four-line stanza, chorus |
| `pk.midi` | قومی ترانہ (Qaumī Tarānah) | [Wikimedia Commons `Tarana.mid`](https://commons.wikimedia.org/wiki/File:Tarana.mid) — CC BY 2.5 (Mahdi7, www.mahdi.ms), **not committed** | twelve tracks named exactly as the 1991 World Atlas files are (`trumpet(s)`, `fr. horn(s)`, `strings (hi)` …) though uploaded as own work. The score is the `trumpet(s)` top voice, with the `strings (hi)` top voice an octave down filling the nine beats where the trumpet rests at the start of the second strain. Already in the recording's B♭ — **no transposition**, five of nine held notes confirming it from their fundamentals. The file's tempo ramps 72 → 83.5 over 49 changes where the band holds about 75. Rhythm checked against the 1949 piano sheet (Commons, PD — Chagla died 1953), which is written in F, a fifth above |
| `br.midi` | Hino Nacional Brasileiro | [flutetunes.com](https://www.flutetunes.com/tunes.php?id=756), the site's own flute lead sheet and its MIDI — freely available, **not committed** | monophonic, B♭ major, 4/4, ♩=120: the stanza under a repeat with two endings and a coda, the repeat written out in the file (733 notes, 438 beats); the score is the second pass, 223.5 beats, pickup to coda. **No introduction** — the arrangement omits it, and none is needed: Brazil's introduction is the first quatrain's own melody played with trills, which is why the Navy tape's first 31 s match the stanza's first 64 beats chunk for chunk, and why the band then goes on from the second quatrain. Already in the band's B♭ — no transposition (chroma 0.25 at +0, nothing above 0.11 at any other shift). Checked against the 1922 official edition's first page on Commons (the vocal F, a tone and a half lower) for the shape of the introduction. BitMidi has no Brazilian anthem and none of the 72 Wikipedia editions carries a `<score>` block; the UNESP library's Furio Franceschini MIDI was looked at too (polyphonic, intro included) but not used |
| `mx.midi` | Himno Nacional Mexicano | [flutetunes.com](https://www.flutetunes.com/tunes.php?id=297), the site's own flute-and-piano lead sheet and its MIDI — freely available, **not committed** | the flute track: C major, cut time, *Marcial* 𝅗𝅥 = 60, the chorus (bars 1–12, *Fine*) then the stanza (13–29) and *D.C. al Fine*, which the file writes out — chorus, stanza, chorus, 166 quarter-beats, 231 tokens. **Transposed up a minor third to the Navy Band's E♭**: the tape's final chord is E♭–G–B♭ (30 / 12 / 24 % of its pitch-class energy) and the chorus ends the same way; the held melody tonics measure E♭ from their fundamentals where the bass does not drown them. Chroma alone could not pick E♭ from B♭ — the two scales share six notes — so the chord settled it. **No introduction**: neither the sheet nor the band has one; the band's chorus pickup sounds at 1.2 s. The band plays the chorus at 102.75 and the whole at about 103 against the printed 120, and plays exactly the sheet's form. BitMidi has no Mexican anthem and none of the 54 Wikipedia editions carries a `<score>` block |
| `ar.musicxml` | Himno Nacional Argentino | [IMSLP 974144](https://imslp.org/wiki/Special:ImagefromIndex/974144), Julián Tavela's two-violin arrangement, MusicXML in its engraving files — CC BY-SA 4.0, **not committed** | the first violin: B♭ major, 4/4, 78 bars and 312 beats, Esnaola's official form entire — introduction (bars 1–23, slow then fast), verse, interlude, chorus (58–78). **The score keeps the chorus**, bars 58–78, 96 beats at 132 with bars 67–69 doubled, since the sheet marks ♩ = 76 and 60 there against 132 around them and the band plays them so. **No transposition**: the tape's final chord is B♭–D–F and the fast introduction ends on the same triad. Checked bar by bar against Héctor Monacci's typeset of the official piano-and-voice version on Commons (CC BY-SA 3.0), which also gave the structure: the Navy *abridged* tape is bars 1–23 then 58–78, its *short* tape the introduction alone, its *full* tape all 78. The individual MusicXML parts IMSLP also serves (772665) hold one instrument each — the first downloaded was the cello. BitMidi, flutetunes and the 66 Wikipedia editions have nothing |
| Het Wilhelmus (Netherlands) | the three `<score>` blocks on [nl.wikipedia](https://nl.wikipedia.org/wiki/Wilhelmus) — the tune in G major as three LilyPond fragments, the first marked `\repeat volta 2` | Assembled A A B C: the first phrase twice, then two more, which is the shape Wikipedia describes and the recording confirms — its three internal gaps (14.1, 27.8, 44.0 s) fall exactly where 14 + 14 + 16 beats end. 60 beats in all. Transposed down two semitones to the recording's F, measured from fundamentals (F and C far ahead of D, B♭, A). One reading of the source was needed: its last note is written `g2 .|`, a dotted half with the dot spaced off, which is what closes phrase C to 16 beats like B. Tempo 60 from the recording's own phrase lengths, 62 / 63 / 62 before the closing ritardando |
| سرود ملی جمهوری اسلامی ایران (Iran) | Sid Dabir's sheet music on [nationalanthems.info](https://nationalanthems.info/ir.htm) (the GIF `ir~.gif`) — CC BY 4.0, credited in the app's README, **not committed** | Two staves in F, 17 bars of 4/4; the melody is the top staff, read bar by bar from noteheads located by pixel row, every bar summing to four beats. Bars 1–2 are a fanfare on one repeated note and are the recording's introduction, so the score is the pickup at the end of bar 2 and bars 3–17, 61 beats. Transposed up a minor third to the recording's A♭ — a time-warping alignment of a rendering against the recording costs 0.305 in A♭ and over 0.40 in every other key, and the final chord is A♭–C–E♭. From bar 4 every bar of the band takes 3.0 s, so tempo 80. The site's own Sibelius rendering of the same sheet is in G and has its own form, so it was no help as a check |
| Il Canto degli Italiani (Italy) | Maurizio Benedetti's revision of Novaro's score, voice and piano, two pages on [nationalanthems.info](https://nationalanthems.info/it.htm) (`it~1.jpg`, `it~2.jpg`) — CC BY 4.0, credited in the app's README, **not committed** | The voice line from the pickup into bar 14 to "chia-mò" in bar 47, 133.5 beats: the verse in B♭, an 8.75-beat rest over the instrumental bridge of bars 29–30, then the Allegro mosso in E♭ — the verse again and "Stringiamci" twice. The sheet is 500 px wide, its staff lines 4 px apart, so page one was read by eye against pitch guides drawn on the enlarged staff; its first four bars agree in pitch with the `<score>` on [it.wikipedia](https://it.wikipedia.org/wiki/Il_Canto_degli_Italiani), whose quarter and rest in bars 16 and 20 the sheet writes as a half note, and the sheet was followed. Page two agrees note for note with the `<score>` on [en.wikipedia](https://en.wikipedia.org/wiki/Il_Canto_degli_Italiani). No transposition: a slope-limited time-warping fit of the whole score against the recording puts both pages at no shift, cost 0.363, the voice entering at 24.1 s after the 23.73 s intro. The band takes page one at 120 and page two at 126, so tempo 124. The final "sì!" is an unpitched x notehead and is left out |
| بلادي بلادي بلادي (Egypt) | the piano arrangement of Sayed Darwish's "Bilady" on [nationalanthems.info](https://nationalanthems.info/eg.htm) (`eg~.gif`) — CC BY 4.0, credited in the app's README, **not committed** | The top line, F major, a pickup and twenty bars of 4/4, 79.25 beats: A A' B B' and A again an octave up. Read with pitches measured by pixel row and rhythm by eye, every bar summing to four. It replaced the World Atlas trumpet line, which played the dotted rhythm even. The piano's short runs where the voice holds a note (bars 10, 12, 14, 16) are kept. Tempo 96, the printed one; the band is slower (73.6) and 🎼 is not held to it |
| Himni i Flamurit (Albania) | the melody sheet with Albanian lyrics on [nationalanthems.info](https://nationalanthems.info/al.htm) (`al~.gif`) — CC BY 4.0, credited in the app's README, **not committed** | One staff in G major, 4/4, three systems: a pickup, the verse's eight bars, and a chorus of seven bars with a first and second ending, 96 beats written out with the repeat. Pitches measured by pixel row, the hollow half notes and the G♯s read by eye, rhythm by eye, every bar summing to four. The engraving credits "Ciprian Stavre Drenova"; the page names the composer as Ciprian Porumbescu. Transposed up a semitone to the recording's A♭ — a time-warping fit costs 0.292 in A♭ and over 0.40 in every other key, and the final chord is A♭–E♭. The sheet prints no tempo; the band takes the verse at 90 and the choruses at 94 and 90; tempo 90, chosen by ear |

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

Every other file here (`sy` `lb` `ae` `om` `th` `tr` `gr` `se` `be` `dk` `es` `eg` `fr` `gb` `tn` `pe` `lr` `in` `nz`) is **not committed** — they are
listed in `.gitignore`. They carry "(p) (c) The Software Toolworks 1991" in their
metadata, so they are someone else's copyrighted arrangements; redistributing
them from a public repo is not ours to do. They stay on disk locally for
reference, and the table above records where to get them again. What ships is
only the melodies transcribed from them, in `public/melody/*.txt`.

Note that the underlying compositions are a separate question from the MIDI
files: several anthem melodies here are 20th-century works still in copyright in
many countries (Syria's and Iraq's are both by Mohammed Flayfel, d. 1986). They
are used here for education, credited, and can be removed on request.

## Not yet sourced

**Andorra (El gran Carlemany).** Commons has a public-domain MIDI
([`El Gran Carlemany.mid`](https://commons.wikimedia.org/wiki/File:El_Gran_Carlemany.mid),
a user's own sequencing rather than a published arrangement) whose first track is
a monophonic 119-note line, and it agrees with the recording on the key, G, which
the audio file's own page states independently. But the fit is weak where every
other score here is strong: **r = 0.38**, against 0.60 for China and 0.55 for
Liberia; only two of the nine notes held 1.5 beats or more measure the key from
their fundamentals; and the MIDI's *bass* tracks score higher against the
recording than its melody track does, which is what happens when the match is
being made on harmony rather than on the tune. Not enough to write notes down on.

The same fit puts the melody 4.97 s in, which would be an intro, but the level is
flat across those five seconds and the fit is too weak to carry the claim alone.
Both wait on a better source — a `<score>` block (none exists in any of the 61
Wikipedia editions), published sheet music, or a MIDI from a known collection.



**Iraq (موطني / Mawtini).** Still missing, and the obvious candidate is a trap:
every MIDI found under "National Anthem – Iraq" comes from the same Software
Toolworks *World Atlas* 1991 collection, and in 1991 Iraq's anthem was
أرض الفراتين (Ardh Alforatain, 1981–2003) — **not** Mawtini, which was only
adopted in 2004. Using it would put the wrong anthem in the app.

Checked and came up empty: Wikimedia Commons (no notation for Mawtini),
Wikipedia in six languages (no `<score>`/LilyPond block), Cantorion (no entry),
nationalanthems.info (no score file), MuseScore (blocks automated download),
ScoreExchange (its "preview" is only the flag image). Extracting the melody from
`public/sound/instrument/iq.aac` also failed — the orchestral texture makes the
pitch tracker follow harmonics and accompaniment instead of the tune.

What would work: a MusicXML/MIDI of Mawtini, or any legible sheet music (PDF or
image) — reading notation from a rendered score is how Syria's key, metre and
tempo were confirmed.
