#!/usr/bin/env python3
"""
Regenerate the spoken number files for one language.

    python3 tools/regen-audio.py ar          # rewrite public/sound/lang/ar/0..15.aac
    python3 tools/regen-audio.py ar --dry    # print what it would say, write nothing

Needs `pip install edge-tts` and ffmpeg on PATH.

The words come from src/digits/*.ts, so the audio cannot drift from the labels on
screen — that mismatch is the one bug worth guarding against here, since a wrong
sound makes the guessing game unwinnable rather than merely odd.

SPEAK is the exception: where a language's normal spelling is read wrongly, it
holds the text to *say* while the app keeps showing what is in the digit file.
Arabic ten is the case that prompted this. A final ة is silent in pause position,
so عشرة came out as the bare stem ʿashr; the fatha in عَشَرَةَ forces it to
ʿasharah. Fifteen needed the same treatment for a different reason — the ة sits
mid-phrase there and should be voiced anyway, but خمسة still reduced to خمس, so
the fatha is spelled out. Thirteen and fourteen do not need it.

Note that Edge is not deterministic: the same text gives a slightly different
recording every run. Do not expect reruns to reproduce byte-identical files, and
do not use a checksum to check whether a file says the right thing.
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIGITS = ROOT / 'src' / 'digits'
SOUND = ROOT / 'public' / 'sound' / 'lang'

# One voice per language, matching the sister apps so a learner hears the same
# speaker across Week, Colors, Flags and Numbers.
VOICES = {
	'en': 'en-US-AvaNeural',
	'ar': 'ar-SA-HamedNeural',
	'de': 'de-DE-KatjaNeural',
	'sv': 'sv-SE-SofieNeural',
	'fr': 'fr-FR-DeniseNeural',
	'tr': 'tr-TR-EmelNeural',
	'fa': 'fa-IR-DilaraNeural',
	'ru': 'ru-RU-SvetlanaNeural',
	'fi': 'fi-FI-NooraNeural',
	'es': 'es-ES-ElviraNeural',
	'he': 'he-IL-HilaNeural',
	'el': 'el-GR-AthinaNeural',
}

# (language, digit) -> what to say, where it differs from what is shown
SPEAK = {
	('ar', 10): 'عَشَرَةَ',
	('ar', 15): 'خَمْسَةَ عَشَر',
}


def words(lang: str) -> dict[int, str]:
	"""The digit labels for a language, read straight out of the digit files."""
	out = {}
	for n in range(16):
		src = (DIGITS / f'{n}.ts').read_text()
		# only the name map, so `code: '13'` cannot be mistaken for a `de:` entry
		block = re.search(r'name: \{(.*?)\n\t\},', src, re.S).group(1)
		found = dict(re.findall(r"^\t\t(\w+): '(.*)',$", block, re.M))
		if lang not in found:
			sys.exit(f'{n}.ts has no "{lang}" name')
		out[n] = found[lang]
	return out


def main() -> None:
	ap = argparse.ArgumentParser()
	ap.add_argument('lang', choices=sorted(VOICES))
	ap.add_argument('--dry', action='store_true')
	args = ap.parse_args()

	voice = VOICES[args.lang]
	shown = words(args.lang)
	plan = [(n, shown[n], SPEAK.get((args.lang, n), shown[n])) for n in range(16)]

	print(f'{args.lang} — {voice}')
	for n, label, spoken in plan:
		note = '   (spoken differs from label)' if spoken != label else ''
		print(f'  {n:>2}  {label}{note}')
	if args.dry:
		return

	out = SOUND / args.lang
	out.mkdir(parents=True, exist_ok=True)
	tmp = out / '_tmp.mp3'
	for n, _, spoken in plan:
		subprocess.run(['python3', '-m', 'edge_tts', '-v', voice, '-t', spoken,
		                '--write-media', str(tmp)], check=True, capture_output=True)
		if tmp.stat().st_size < 2000:
			sys.exit(f'{n}: synthesis came back empty')
		# match the rest of the library: mono, 24 kHz, 64 kbps AAC
		subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(tmp),
		                '-ac', '1', '-ar', '24000', '-c:a', 'aac', '-b:a', '64k',
		                str(out / f'{n}.aac')], check=True)
	tmp.unlink(missing_ok=True)
	print(f'wrote {len(plan)} files to {out.relative_to(ROOT)}')


if __name__ == '__main__':
	main()
