#!/usr/bin/env python3
"""
Regenerate the spoken names of Week's days, months and seasons for one language.

    python3 tools/regen-audio.py sv                      # rewrite every sv recording
    python3 tools/regen-audio.py sv --only m1-m12,winter # just those — the rest stay
    python3 tools/regen-audio.py sv --dry                # print what it would say
    python3 tools/regen-audio.py sv --only m3 --out /tmp/review   # somewhere else

`--only` takes codes, comma-separated: days `1`–`7` (Sunday = 1), months
`m1`–`m12`, seasons `winter`, `spring`, `summer`, `autumn`; `m1-m12` and `1-7`
are ranges. Because Edge is not deterministic (see below), rewriting a whole
language re-rolls recordings that were fine; when items are *added*, record
only them. `--out` writes there instead of public/sound/lang/<lang>, for
listening to a batch before it is kept.

Needs `pip install edge-tts` (7.3.1 or later) and ffmpeg on PATH.

The words come from src/days, src/months and src/seasons, so the audio cannot
drift from the names on screen — that mismatch is the one bug worth guarding
against here, since a wrong sound makes the guessing game unwinnable rather
than merely odd.

SPEAK is for a language whose normal spelling is read wrongly: it holds the
text to *say* while the app keeps showing what is in the item file. Nothing
needs it yet.

Edge is not deterministic: the same text gives a slightly different recording
every run. Do not expect reruns to reproduce byte-identical files, and do not
use a checksum to check whether a file says the right thing.
"""
import argparse
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'
SOUND = ROOT / 'public' / 'sound' / 'lang'

# One voice per language, the ones the README credits. Arabic is Fatima, from
# the Emirates, not Amany from Syria: Amany ends a word stopped on ف with an
# /s/, so she said الصيف and الخريف as aṣ-ṣays and al-kharīs, and no spelling
# changed that.
VOICES = {
	'en': 'en-US-AvaNeural',
	'ar': 'ar-AE-FatimaNeural',
	'de': 'de-DE-KatjaNeural',
	'sv': 'sv-SE-SofieNeural',
	'uk': 'uk-UA-PolinaNeural',
	'he': 'he-IL-HilaNeural',
	'el': 'el-GR-AthinaNeural',
	'tr': 'tr-TR-EmelNeural',
}

# (language, code) -> what to say, where it differs from what is shown
SPEAK: dict[tuple[str, str], str] = {}

SEASONS = ['winter', 'spring', 'summer', 'autumn']


def items() -> dict[str, Path]:
	"""Every item the app has, in timeline order: days, months, seasons."""
	days = [str(n) for n in range(1, 8)]
	months = [f'm{n}' for n in range(1, 13)]
	found = {code: SRC / 'days' / f'{code}.ts' for code in days}
	found |= {code: SRC / 'months' / f'{code}.ts' for code in months}
	found |= {code: SRC / 'seasons' / f'{code}.ts' for code in SEASONS}
	missing = [code for code, path in found.items() if not path.exists()]
	if missing:
		sys.exit(f'no item file for {", ".join(missing)}')
	return found


def parse_only(spec: str, have: dict[str, Path]) -> list[str]:
	"""`m1-m3,winter` → the codes asked for, in timeline order."""
	wanted: set[str] = set()
	for part in (p.strip() for p in spec.split(',') if p.strip()):
		m = re.fullmatch(r'(m?)(\d+)-(m?)(\d+)', part)
		if m and m.group(1) == m.group(3):
			wanted |= {f'{m.group(1)}{n}' for n in range(int(m.group(2)), int(m.group(4)) + 1)}
		else:
			wanted.add(part)
	unknown = sorted(wanted - set(have))
	if unknown:
		sys.exit(f'no item {", ".join(unknown)}')
	return [code for code in have if code in wanted]


def words(lang: str, which: list[str], have: dict[str, Path]) -> dict[str, str]:
	"""The names for a language, read straight out of the item files."""
	out = {}
	for code in which:
		src = have[code].read_text()
		# only the name map, so `short` cannot be mistaken for it
		block = re.search(r'name: \{(.*?)\n\t\},', src, re.S).group(1)
		found = dict(re.findall(r"^\t\t(\w+): '(.*)',$", block, re.M))
		if lang not in found:
			sys.exit(f'{have[code].name} has no "{lang}" name')
		out[code] = found[lang]
	return out


def main() -> None:
	ap = argparse.ArgumentParser()
	ap.add_argument('lang', choices=sorted(VOICES))
	ap.add_argument('--only', help='codes to record, e.g. m1-m12,winter; default: all')
	ap.add_argument('--out', help='write here instead of public/sound/lang/<lang>')
	ap.add_argument('--dry', action='store_true')
	args = ap.parse_args()

	voice = VOICES[args.lang]
	have = items()
	which = parse_only(args.only, have) if args.only else list(have)
	shown = words(args.lang, which, have)
	plan = [(code, shown[code], SPEAK.get((args.lang, code), shown[code])) for code in which]

	print(f'{args.lang} — {voice}')
	for code, label, spoken in plan:
		note = '   (spoken differs from label)' if spoken != label else ''
		print(f'  {code:>6}  {label}{note}')
	if args.dry:
		return

	out = Path(args.out) if args.out else SOUND / args.lang
	out.mkdir(parents=True, exist_ok=True)
	tmp = out / '_tmp.mp3'
	for code, _, spoken in plan:
		subprocess.run(['python3', '-m', 'edge_tts', '-v', voice, '-t', spoken,
		                '--write-media', str(tmp)], check=True, capture_output=True)
		if tmp.stat().st_size < 2000:
			sys.exit(f'{code}: synthesis came back empty')
		# match the rest of the library: mono, 24 kHz, 64 kbps AAC
		subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(tmp),
		                '-ac', '1', '-ar', '24000', '-c:a', 'aac', '-b:a', '64k',
		                str(out / f'{code}.aac')], check=True)
	tmp.unlink(missing_ok=True)
	print(f'wrote {len(plan)} files to {out}')


if __name__ == '__main__':
	main()
