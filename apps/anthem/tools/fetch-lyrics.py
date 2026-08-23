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
	'lu': {
		'lang': 'lb',
		'wiki': 'lb',
		'site': 'wikipedia',
		'page': 'Ons Heemecht',
		'section': 'Gesangstext',
		'bare_lines': True,
		# the law of 27 July 1993 names the first and the fourth stanza as the
		# anthem. The article prints them as sung — the closing two lines of
		# each repeat — among seven stanzas including later additions
		'take': [[1, 10], [27, 36]],
		'stanzas': 2,
		'pd': 'words Michel Lentz, died 1893; music Jean Antoine Zinnen, died 1898',
	},
	'it': {
		'lang': 'it',
		'wiki': 'it',
		# the whole poem as one 55-line <poem> block; protocol sings the first
		# stanza and the Stringiamci refrain, which `take` carves out
		'page': 'Canto nazionale',
		'take': [[1, 8], [9, 11]],
		'stanzas': 2,
		'pd': 'words Goffredo Mameli, died 1849; music Michele Novaro, died 1885',
	},
	'dk': {
		'lang': 'da',
		'wiki': 'da',
		'page': 'Der er et yndigt land',
		# the verse sits as bare lines between two infobox templates, no <poem>
		'bare_lines': True,
		# the page carries the shortened four-stanza form that is sung, not
		# Oehlenschläger's original twelve
		'stanzas': 4,
		'expect_lines': 6,
		'pd': 'words Adam Oehlenschläger, died 1850; music Hans Ernst Krøyer, died 1879',
	},
	'eg': {
		'lang': 'ar',
		'wiki': 'en',
		# no Wikisource page in any language; the English article carries the Arabic
		# original as its first <poem>, followed by transliteration and translations
		'site': 'wikipedia',
		'page': 'Biladi, Biladi, Biladi',
		'poem': 0,
		# stanzas are uneven here (5, 5, 1, 5, 1, 5, 1) because the refrain line is
		# set apart, so there is no uniform line count to check against
		'pd': ('words Younis al-Qadi, died 1969; music Sayed Darwish, died 1923. '
		       'Egypt is life + 50 under Law 82/2002 art. 160, not life + 70, so the '
		       'words entered the public domain in 2020'),
	},
	'fr': {
		'lang': 'fr',
		'wiki': 'fr',
		# fr.wikisource transcludes this from a DjVu scan, so its raw wikitext holds
		# no verse; the Wikipedia article has it inline instead
		'site': 'wikipedia',
		'page': 'La Marseillaise',
		# what is actually sung: the first verse, then the refrain. The article carries
		# all seven verses in separate blocks; the other six are not the anthem.
		'poem': [0, 1],
		'stanzas': 2,
		'pd': 'words and music Claude Joseph Rouget de Lisle, died 1836',
	},
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
	'hu': {
		'lang': 'hu',
		'wiki': 'hu',
		# "Himnusz" alone is a disambiguation page, and "Hymnus" is a different poem
		# altogether — Vörösmarty's. Only the qualified title is Kölcsey's.
		'page': 'Himnusz (Kölcsey Ferenc)',
		# the poem runs to eight stanzas; Hungary sings the first, as with the Czech
		# anthem, so the count matters here
		'stanzas': 1,
		'expect_lines': 8,
		'pd': 'words Ferenc Kölcsey, died 1838; music Ferenc Erkel, died 1893',
	},
}


def wikitext(wiki: str, page: str, site: str = 'wikisource') -> str:
	url = (f'https://{wiki}.{site}.org/w/index.php'
	       f'?title={urllib.parse.quote(page.replace(" ", "_"))}&action=raw')
	req = urllib.request.Request(url, headers={'User-Agent': UA})
	with urllib.request.urlopen(req, timeout=30) as r:
		return r.read().decode('utf-8')


def stanzas_of(text: str) -> list[list[str]]:
	"""Split plain verse text into stanzas on blank lines."""
	# comments can span lines, so they go before the line split
	text = re.sub(r'<!--.*?-->', '', text, flags=re.S)
	out, cur = [], []
	for line in text.strip('\n').split('\n'):
		line = re.sub(r"''+", '', line)                  # drop wiki italics
		line = re.sub(r'\[\[[^\]|]*\|([^\]]*)\]\]', r'\1', line)  # [[X|Y]] -> Y
		line = re.sub(r'\[\[([^\]]*)\]\]', r'\1', line)           # [[X]] -> X
		line = re.sub(r'\{\{[Ll]arger\|([^}]*)\}\}', r'\1', line)  # drop-cap template
		line = re.sub(r'\{\{R\|[^}]*\}\}', '', line)              # printed line numbers
		# Wikisource often ends each verse line with an explicit <br>. Left in, it
		# lands in the txt file as literal markup — which is what happened to the
		# Danish lyrics before this, and had to be stripped by hand.
		line = re.sub(r'</?br\s*/?>', '', line, flags=re.I)
		line = re.sub(r'</?[a-zA-Z][^>]*>', '', line).strip()
		if line:
			cur.append(line)
		elif cur:
			out.append(cur); cur = []
	if cur:
		out.append(cur)
	return out


def extract(src: str, spec: dict) -> list[list[str]]:
	"""The verse text of the wanted section, as a list of stanzas.

	Two page shapes turn up. Most wrap the verse in <poem>, which is unambiguous.
	Some — the Danish one — set it as bare lines between infobox templates, so
	those templates have to be stripped first or their fields read as verse.
	"""
	if spec.get('section'):
		m = re.search(rf'^==\s*{re.escape(spec["section"])}\s*==\s*$', src, re.M)
		if not m:
			sys.exit(f'section {spec["section"]!r} not found — the page may have been restructured')
		src = src[m.end():]

	poems = re.findall(r'<poem[^>]*>(.*?)</poem>', src, re.S)
	if poems:
		# An article can carry the same text several times over — original,
		# transliteration, translation — so the wanted block is named by index. It can
		# also split what is sung across blocks, a verse and its refrain being separate
		# on the French page, so `poem` may be a list and the blocks are joined in the
		# order given.
		want = spec.get('poem', 0)
		idxs = want if isinstance(want, (list, tuple)) else [want]
		for i in idxs:
			if i >= len(poems):
				sys.exit(f'wanted <poem> block {i} but the page has {len(poems)}')
		out = []
		for i in idxs:
			out.extend(stanzas_of(poems[i]))
		return out

	if not spec.get('bare_lines'):
		sys.exit('no <poem> block, and this source is not marked bare_lines')
	# drop {{templates}} (including multi-line ones), links and category lines
	src = re.sub(r'\{\{.*?\n\}\}', '', src, flags=re.S)
	src = re.sub(r'^\{\{.*?\}\}\s*$', '', src, flags=re.M)
	src = re.sub(r'^\[\[.*?\]\]\s*$', '', src, flags=re.M)
	src = re.sub(r'^=+.*?=+\s*$', '', src, flags=re.M)
	return stanzas_of(src)


def main() -> None:
	ap = argparse.ArgumentParser()
	ap.add_argument('code', nargs='?')
	ap.add_argument('--dry', action='store_true')
	ap.add_argument('--force', action='store_true',
	                help='overwrite an existing file (refused by default)')
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

	stanzas = extract(wikitext(spec['wiki'], spec['page'], spec.get('site', 'wikisource')), spec)

	# Some pages set a whole poem as one unbroken block. `take` carves the sung
	# part out of it: 1-based inclusive line ranges, one per stanza.
	if spec.get('take'):
		lines = [l for st in stanzas for l in st]
		stanzas = [lines[a - 1:b] for a, b in spec['take']]

	print(f'{args.code}: fetched {len(stanzas)} stanzas of '
	      f'{[len(s) for s in stanzas]} lines')

	# A bare-lines page can open with prose — a header or a note — that splits into
	# a stanza like any other. Drop those from the front, but say so: silently
	# discarding blocks is how a real verse would go missing unnoticed.
	if spec.get('expect_lines'):
		while stanzas and len(stanzas[0]) != spec['expect_lines']:
			dropped = stanzas.pop(0)
			print(f'  skipped a leading {len(dropped)}-line block '
			      f'(expected {spec["expect_lines"]}-line stanzas)')

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
	# Refuse to overwrite by default. What comes out of a wiki page usually needs a
	# once-over — the Danish file had a stray <br> on every line and the Egyptian one
	# was reshaped by hand — and re-running this to "refresh" a country would throw
	# that away without a word.
	if out.exists() and not args.force:
		current = out.read_text(encoding='utf-8')
		if current == text:
			print('already up to date, nothing to do')
		else:
			print(f'{out.relative_to(ROOT)} exists and differs from what would be '
			      f'written ({len(current)} chars on disk, {len(text)} fetched).\n'
			      f'Refusing to overwrite — it may have been corrected by hand. '
			      f'Pass --force to replace it.')
		return
	out.parent.mkdir(parents=True, exist_ok=True)
	out.write_text(text, encoding='utf-8')
	print('written')


if __name__ == '__main__':
	main()
