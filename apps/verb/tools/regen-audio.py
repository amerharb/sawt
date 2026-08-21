#!/usr/bin/env python3
"""
Regenerate one language's verb recordings into public/sound/lang/<lang>/<scene>/.

    python3 tools/regen-audio.py ar          # write every scene the language has
    python3 tools/regen-audio.py ar --dry    # print the plan, write nothing

Each verb is recorded once per MOMENT the language distinguishes (see
src/moments.ts): the do! command, the doing present, the did simple past and
the done perfect. Arabic has no play-once past — its ماضي speaks over the done
aftermath scene — so it records three scenes, the others four.

The voices are the same ones the sister apps use. What is spoken comes from
SPEAK below, not from the app's source: display names carry no tashkeel, but
Arabic TTS needs it, and the imperatives carry a '!' for intonation.

edge-tts is non-deterministic — the same text gives a different file every run,
so checksums and durations prove nothing about content. The only verification
that means anything is listening.
"""
import argparse
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOUND = ROOT / 'public' / 'sound' / 'lang'

VOICES = {
	'en': 'en-US-AvaNeural',
	'ar': 'ar-SA-HamedNeural',
	'de': 'de-DE-KatjaNeural',
	'sv': 'sv-SE-SofieNeural',
}

# lang -> scene -> code -> what to say.
# German did is Präteritum by the owner's choice; its done is the spoken
# Perfekt — and schwimmen takes sein: "ist geschwommen", not "hat".
SPEAK = {
	'en': {
		'do': { 'eat': 'eat!', 'swim': 'swim!' },
		'doing': { 'eat': 'eating', 'swim': 'swimming' },
		'did': { 'eat': 'ate', 'swim': 'swam' },
		'done': { 'eat': 'has eaten', 'swim': 'has swum' },
	},
	'ar': {
		'do': { 'eat': 'كُلْ', 'swim': 'اِسْبَحْ' },
		'doing': { 'eat': 'يَأْكُل', 'swim': 'يَسْبَح' },
		'done': { 'eat': 'أَكَلَ', 'swim': 'سَبَحَ' },
	},
	'de': {
		'do': { 'eat': 'iss!', 'swim': 'schwimm!' },
		'doing': { 'eat': 'isst', 'swim': 'schwimmt' },
		'did': { 'eat': 'aß', 'swim': 'schwamm' },
		'done': { 'eat': 'hat gegessen', 'swim': 'ist geschwommen' },
	},
	'sv': {
		'do': { 'eat': 'ät!', 'swim': 'simma!' },
		'doing': { 'eat': 'äter', 'swim': 'simmar' },
		'did': { 'eat': 'åt', 'swim': 'simmade' },
		'done': { 'eat': 'har ätit', 'swim': 'har simmat' },
	},
}


def main() -> None:
	ap = argparse.ArgumentParser()
	ap.add_argument('lang', choices=sorted(VOICES))
	ap.add_argument('--dry', action='store_true')
	args = ap.parse_args()

	voice = VOICES[args.lang]
	plan = [(scene, code, spoken)
	        for scene, words in SPEAK[args.lang].items()
	        for code, spoken in sorted(words.items())]

	print(f'{args.lang} — {voice}')
	for scene, code, spoken in plan:
		print(f'  {scene:<6} {code:<6} "{spoken}"')
	if args.dry:
		return

	for scene, code, spoken in plan:
		out = SOUND / args.lang / scene
		out.mkdir(parents=True, exist_ok=True)
		tmp = out / '_tmp.mp3'
		subprocess.run(['python3', '-m', 'edge_tts', '-v', voice, '-t', spoken,
		                '--write-media', str(tmp)], check=True, capture_output=True)
		if tmp.stat().st_size < 2000:
			sys.exit(f'{scene}/{code}: synthesis came back empty')
		# match the rest of the library: mono, 24 kHz, 64 kbps AAC
		subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(tmp),
		                '-ac', '1', '-ar', '24000', '-c:a', 'aac', '-b:a', '64k',
		                str(out / f'{code}.aac')], check=True)
		tmp.unlink(missing_ok=True)
	print(f'wrote {len(plan)} files under {(SOUND / args.lang).relative_to(ROOT)}')


if __name__ == '__main__':
	main()
