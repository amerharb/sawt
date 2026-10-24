#!/usr/bin/env python3
"""
Regenerate the spoken colour names for one language.

    python3 tools/regen-audio.py es                # rewrite every colour's es recording
    python3 tools/regen-audio.py es --only 088,808 # just those — the rest stay as they are
    python3 tools/regen-audio.py es --dry          # print what it would say, write nothing

`--only` takes colour codes, comma-separated. Because Edge is not deterministic
(see below), rewriting a whole language re-rolls recordings that were fine; when
colours are *added*, record only them.

Needs `pip install edge-tts` and ffmpeg on PATH. edge-tts 7.2.8 started getting
a 403 from the speech service in October 2026; 7.3.1 works.

The words come from src/colors/*.ts, so the audio cannot drift from the names on
screen — that mismatch is the one bug worth guarding against here, since a wrong
sound makes the guessing game unwinnable rather than merely odd.

SPEAK is for a language whose normal spelling is read wrongly: it holds the text
to *say* while the app keeps showing what is in the colour file, as Number's
Arabic ten does. No colour needs it yet.

Note that Edge is not deterministic: the same text gives a slightly different
recording every run. Do not expect reruns to reproduce byte-identical files, and
do not use a checksum to check whether a file says the right thing.
"""
import argparse
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COLORS = ROOT / 'src' / 'colors'
SOUND = ROOT / 'public' / 'sound' / 'lang'

# One voice per language, the ones the README credits. Arabic is Amany here, as
# in Week, where Number and Flag have Hamed.
VOICES = {
	'en': 'en-US-AvaNeural',
	'ar': 'ar-SY-AmanyNeural',
	'de': 'de-DE-KatjaNeural',
	'sv': 'sv-SE-SofieNeural',
	'uk': 'uk-UA-PolinaNeural',
	'he': 'he-IL-HilaNeural',
	'es': 'es-ES-ElviraNeural',
}

# (language, code) -> what to say, where it differs from what is shown
SPEAK: dict[tuple[str, str], str] = {}


def codes() -> list[str]:
	"""Every colour the app has — whatever src/colors/ holds."""
	return sorted(p.stem for p in COLORS.glob('*.ts') if re.fullmatch(r'[0-9a-f]{3}', p.stem))


def parse_only(spec: str, have: list[str]) -> list[str]:
	"""`088,808` → the codes asked for, each of which must exist."""
	wanted = {part.strip().lower() for part in spec.split(',') if part.strip()}
	missing = sorted(wanted - set(have))
	if missing:
		sys.exit(f'no colour file for {", ".join(missing)}')
	return sorted(wanted)


def words(lang: str, which: list[str]) -> dict[str, str]:
	"""The colour names for a language, read straight out of the colour files."""
	out = {}
	for code in which:
		src = (COLORS / f'{code}.ts').read_text()
		# only the name map, so `code: '808'` cannot be mistaken for an entry
		block = re.search(r'name: \{(.*?)\n\t\},', src, re.S).group(1)
		found = dict(re.findall(r"^\t\t(\w+): '(.*)',$", block, re.M))
		if lang not in found:
			sys.exit(f'{code}.ts has no "{lang}" name')
		out[code] = found[lang]
	return out


def main() -> None:
	ap = argparse.ArgumentParser()
	ap.add_argument('lang', choices=sorted(VOICES))
	ap.add_argument('--only', help='codes to record, e.g. 088,808; default: all')
	ap.add_argument('--dry', action='store_true')
	args = ap.parse_args()

	voice = VOICES[args.lang]
	have = codes()
	which = parse_only(args.only, have) if args.only else have
	shown = words(args.lang, which)
	plan = [(code, shown[code], SPEAK.get((args.lang, code), shown[code])) for code in which]

	print(f'{args.lang} — {voice}')
	for code, label, spoken in plan:
		note = '   (spoken differs from label)' if spoken != label else ''
		print(f'  {code}  {label}{note}')
	if args.dry:
		return

	out = SOUND / args.lang
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
	print(f'wrote {len(plan)} files to {out.relative_to(ROOT)}')


if __name__ == '__main__':
	main()
