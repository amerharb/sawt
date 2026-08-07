#!/usr/bin/env python3
"""
Fetch an anthem's words from Wikisource into public/lyrics/<code>/<language>.txt.

    python3 tools/fetch-lyrics.py cz          # write it
    python3 tools/fetch-lyrics.py cz --dry    # fetch and report, write nothing
    python3 tools/fetch-lyrics.py --list      # what is configured, and why it is allowed

Only words old enough to be public domain belong in this repo, and several anthems
here are not. Rather than keep a blocklist of the ones to avoid — which fails open,
since a country nobody thought about would sail through — SOURCES is an allowlist
and every entry must carry `pd`, a note naming the author and their death year.
A country that is not listed is refused, so adding one means looking the term up.

The fetcher also checks the stanza count it gets back. Several of these pages hold
a whole poem when the anthem is only its first stanza, and the Czech act says so
explicitly: "Státní hymnu tvoří první sloka písně" — the anthem is the first
stanza. Getting that wrong would put three verses on screen where the country
sings one.
"""
import argparse
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LYRICS = ROOT / 'public' / 'lyrics'
UA = 'sawt-anthem/0.20 (https://github.com/amerharb/sawt)'

SOURCES = {
	'cz': {
		'lang': 'cs',
		'wiki': 'cs',
		# The act that adopts the anthem prints it in Příloha 6; a cleaner-looking
		# page exists at "Kde domov můj" but is a disambiguation list, and the other
		# targets on it are different poems that share the title.
		'page': 'Zákon o státních symbolech České republiky',
		'section': 'Příloha 6',
		# § 7: "Státní hymnu tvoří první sloka písně" — the song has two stanzas,
		# the anthem is the first
		'stanzas': 1,
		'expect_lines': 7,
		'pd': 'words Josef Kajetán Tyl, died 1856; music František Škroup, died 1862',
	},
}


def wikitext(wiki: str, page: str) -> str:
	url = (f'https://{wiki}.wikisource.org/w/index.php'
	       f'?title={urllib.parse.quote(page.replace(" ", "_"))}&action=raw')
	req = urllib.request.Request(url, headers={'User-Agent': UA})
	with urllib.request.urlopen(req, timeout=30) as r:
		return r.read().decode('utf-8')


def extract(src: str, spec: dict) -> list[list[str]]:
	"""The <poem> block of the wanted section, as a list of stanzas."""
	if spec.get('section'):
		m = re.search(rf'^==\s*{re.escape(spec["section"])}\s*==\s*$', src, re.M)
		if not m:
			sys.exit(f'section {spec["section"]!r} not found — the page may have been restructured')
		src = src[m.end():]
	m = re.search(r'<poem[^>]*>(.*?)</poem>', src, re.S)
	if not m:
		sys.exit('no <poem> block in that section')
	stanzas, cur = [], []
	for line in m.group(1).strip('\n').split('\n'):
		line = re.sub(r"''+", '', line).strip()          # drop wiki italics
		if line:
			cur.append(line)
		elif cur:
			stanzas.append(cur); cur = []
	if cur:
		stanzas.append(cur)
	return stanzas


def main() -> None:
	ap = argparse.ArgumentParser()
	ap.add_argument('code', nargs='?')
	ap.add_argument('--dry', action='store_true')
	ap.add_argument('--list', action='store_true')
	args = ap.parse_args()

	if args.list or not args.code:
		for c, s in sorted(SOURCES.items()):
			print(f'{c}  {s["lang"]}  {s["page"]}\n     public domain: {s["pd"]}')
		return

	spec = SOURCES.get(args.code)
	if spec is None:
		sys.exit(f'{args.code} is not configured. Add it to SOURCES with a `pd` note '
		         f'naming the author and death year — if the words are still in term, '
		         f'they do not belong in this repo.')

	stanzas = extract(wikitext(spec['wiki'], spec['page']), spec)
	print(f'{args.code}: fetched {len(stanzas)} stanzas of '
	      f'{[len(s) for s in stanzas]} lines')

	want = spec.get('stanzas')
	if want and len(stanzas) < want:
		sys.exit(f'expected at least {want} stanzas, got {len(stanzas)}')
	kept = stanzas[:want] if want else stanzas
	if spec.get('expect_lines'):
		for i, st in enumerate(kept, 1):
			if len(st) != spec['expect_lines']:
				sys.exit(f'stanza {i} has {len(st)} lines, expected {spec["expect_lines"]} '
				         f'— refusing rather than write something malformed')

	text = '\n\n'.join('\n'.join(st) for st in kept) + '\n'
	out = LYRICS / args.code / f'{spec["lang"]}.txt'
	print(f'keeping {len(kept)} stanza(s), {sum(len(s) for s in kept)} lines, '
	      f'{len(text)} characters -> {out.relative_to(ROOT)}')
	if args.dry:
		print('(dry run, nothing written)')
		return
	out.parent.mkdir(parents=True, exist_ok=True)
	out.write_text(text, encoding='utf-8')
	print('written')


if __name__ == '__main__':
	main()
