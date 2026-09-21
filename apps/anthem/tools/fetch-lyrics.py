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
	'tn': {
		'lang': 'ar',
		'wiki': 'en',
		# no Wikisource page; ar.wikipedia sets the words in a {{أبيات}} template with
		# both hemistichs on one line, which this reader cannot take apart. The
		# English article carries the Arabic as its first <poem>: the chorus, then
		# three numbered stanzas with template debris between them
		'site': 'wikipedia',
		'page': 'Humat al-Hima',
		'poem': 0,
		# the anthem as sung — schools, ceremonies, the national teams — is the
		# chorus, Echebbi's stanza, and the chorus again (ar.wikipedia, "الفقرة
		# الرئيسية"; en.wikipedia's "short version"). `take` carves those out of
		# the flat line list, skipping the chorus label, the stanza numbers and the
		# stray braces
		'take': [[2, 5], [27, 30], [2, 5]],
		'stanzas': 3,
		'expect_lines': 4,
		'pd': ('words Mostafa Saadeq Al-Rafe\'ie, died 1937, and Aboul-Qacem Echebbi, '
		       'died 1934; both out of copyright since 2007'),
	},
	'va:it': {
		'lang': 'it',
		'wiki': 'en',
		# no Wikisource page in any language; the English article carries both official
		# texts, the Italian as its first <poem>
		'site': 'wikipedia',
		'page': 'Pontifical Hymn',
		'poem': 0,
		# Allegra's 1949 words: two four-line stanzas, a two-line turn, then the
		# 'Salve, Salve Roma' refrain twice
		'take': [[1, 4], [5, 8], [9, 10], [11, 14], [15, 18]],
		'stanzas': 5,
		'pd': ('official texts of the Vatican State, which the project treats as public domain; Antonio Allegra died 1969 and Raffaello Lavagna 2015, so the usual life-plus-seventy count would not expire until 2040 and 2086'),
	},
	'va:la': {
		'lang': 'la',
		'wiki': 'en',
		'site': 'wikipedia',
		'page': 'Pontifical Hymn',
		# the fifth <poem> is the Latin as sung now — a shortened form of Lavagna's
		# 1991 text, which the article prints separately with its choir-part
		# directions (Vox acuta, Vox media) written into the verse
		'poem': 4,
		'take': [[1, 4], [5, 6], [7, 8], [9, 12], [13, 13]],
		'stanzas': 5,
		'pd': ('official texts of the Vatican State, which the project treats as public domain; Antonio Allegra died 1969 and Raffaello Lavagna 2015, so the usual life-plus-seventy count would not expire until 2040 and 2086'),
	},
	'pl': {
		'lang': 'pl',
		'wiki': 'en',
		# pl.wikisource sets the text in a two-column table (Wybicki's 1797 spelling
		# beside the current one) that this reader cannot take apart; the English
		# article carries the current official text as its first <poem>
		'site': 'wikipedia',
		'page': 'Poland Is Not Yet Lost',
		'poem': 0,
		# the anthem is the first stanza and the refrain. The block numbers its
		# stanzas — 'I', 'Refren:' — so `take` carves the eight verse lines out
		# from between the labels; the 𝄆 𝄇 around the refrain are stripped with
		# the other repeat marks
		'take': [[2, 5], [7, 10]],
		'stanzas': 2,
		'expect_lines': 4,
		'pd': 'words Józef Wybicki, died 1822; the melody is an anonymous 18th-century mazurka',
	},
	'ua': {
		'lang': 'uk',
		'wiki': 'en',
		# uk.wikisource carries Chubynsky's 1862 poem in its period spelling and in
		# several printings; what the law of 6 March 2003 made the anthem is a
		# shortened, slightly reworded first stanza, and the English article prints
		# exactly that as its first <poem>
		'site': 'wikipedia',
		'page': 'National anthem of Ukraine',
		'poem': 0,
		# four lines and a two-line refrain — uneven, so no `expect_lines` to
		# check against; the 𝄆 𝄇 around the refrain go with the other repeat marks
		'take': [[1, 4], [5, 6]],
		'stanzas': 2,
		'pd': ('words Pavlo Chubynsky, died 1884; music Mykhailo Verbytsky, died 1870. '
		       'The 2003 wording is a state symbol, which Ukrainian copyright law does '
		       'not protect'),
	},
	'pt': {
		'lang': 'pt',
		'wiki': 'en',
		# no Wikisource page; the English article carries all three stanzas and the
		# chorus as its first <poem>, numbered I II III
		'site': 'wikipedia',
		'page': 'A Portuguesa',
		'poem': 0,
		# protocol sings the first stanza and the chorus — eight lines and five,
		# uneven, so there is no line count to check against
		'take': [[2, 9], [11, 15]],
		'stanzas': 2,
		'pd': 'words Henrique Lopes de Mendonça, died 1931; music Alfredo Keil, died 1907',
	},
	'no': {
		'lang': 'no',
		'wiki': 'en',
		# no.wikisource has the poem across several printings in period spelling;
		# the English article carries the modern text as its first <poem>, all
		# eight stanzas of eight lines
		'site': 'wikipedia',
		'page': 'Ja, vi elsker dette landet',
		'poem': 0,
		# custom sings the first stanza and the last two; the app carries the
		# first, which is the one nobody argues about, and which is what the
		# other countries here carry
		'take': [[1, 8]],
		'stanzas': 1,
		'expect_lines': 8,
		'pd': 'words Bjørnstjerne Bjørnson, died 1910; music Rikard Nordraak, died 1866',
	},
	'ir': {
		'lang': 'fa',
		'wiki': 'en',
		'site': 'wikipedia',
		'page': 'National Anthem of Iran',
		'poem': 0,
		# seven lines, and unusually the whole anthem — there is no second stanza
		# and no refrain to carve out
		'stanzas': 1,
		'pd': ('NOT an author-death-year claim, and the only entry here that is not. '
		       'Sayed Bagheri wrote the words in 1989 and no death date is published '
		       'for him, so the usual count cannot be made. The ground instead is '
		       'article 16 of Iran\'s 1970 act: a work belonging to a legal entity is '
		       'protected for thirty years from publication, and the anthem was '
		       'adopted in 1990. That is the same ground on which Wikimedia Commons '
		       'hosts the recording this app already ships. It is weaker than a dead '
		       'poet — if the words are Bagheri\'s own rather than the state\'s, the '
		       'term is his life plus fifty and this claim fails — so it is written '
		       'out here rather than waved at.'),
	},
	'jp': {
		'lang': 'ja',
		'wiki': 'en',
		'site': 'wikipedia',
		'page': 'Kimigayo',
		# the first <poem> is the poem in kanji; the second is the same in
		# hiragana, which is a reading aid rather than the text
		'poem': 0,
		'stanzas': 1,
		'expect_lines': 5,
		'pd': ('a waka by an unnamed poet, collected in the Kokin Wakashū around '
		       '920 — no death year to look up and none needed, these being the '
		       'oldest words of any national anthem'),
	},
	'ca:en': {
		'lang': 'en',
		'wiki': 'en',
		'site': 'wikipedia',
		'page': 'O Canada',
		# the first <poem> is the English text, the second the French; each opens
		# with a label line the `take` steps over
		'poem': 0,
		'take': [[2, 10]],
		'stanzas': 1,
		'expect_lines': 9,
		'pd': ('words Robert Stanley Weir, died 1926; music Calixa Lavallée, died '
		       '1891. The third line was changed from "in all thy sons command" to '
		       '"in all of us command" by an Act of Parliament in 2018, and an act '
		       'is not somebody\'s copyright'),
	},
	'ca:fr': {
		'lang': 'fr',
		'wiki': 'en',
		'site': 'wikipedia',
		'page': 'O Canada',
		'poem': 1,
		'take': [[2, 10]],
		'stanzas': 1,
		'expect_lines': 9,
		'pd': 'words Adolphe-Basile Routhier, died 1920; music Calixa Lavallée, died 1891',
	},
	'lr': {
		'lang': 'en',
		'wiki': 'en',
		'site': 'wikipedia',
		'page': 'All Hail, Liberia, Hail!',
		# one <poem> holding both stanzas behind bold numerals the `take` steps
		# over. The 𝄆 𝄇 signs come out as usual; the lines they mark are already
		# written twice where they are sung twice
		'take': [[2, 15], [17, 30]],
		'stanzas': 2,
		'expect_lines': 14,
		'pd': ('words Daniel Bashiel Warner, died 1880; music Olmstead Luca, died '
		       '1869. Warner was Liberia\'s third president and wrote them before '
		       'taking office'),
	},
	'pe': {
		'lang': 'es',
		'wiki': 'en',
		'site': 'wikipedia',
		'page': 'National Anthem of Peru',
		# the "Official lyrics" section holds the words as they are sung, Spanish
		# first then an English translation. What Peru sings is the chorus and the
		# stanza the article numbers VII "(el antiguo sexto verso)" — ordered by
		# the Ministry of Defence in 2009 in place of the familiar "Largo tiempo
		# el peruano oprimido", which Torre Ugarte did not write.
		#
		# Taken from here rather than es.wikisource, which has the cleaner poem but
		# opens this stanza "En sus cima", a slip for "En su cima" that both
		# Wikipedias get right. The repeated half-lines are kept because they are
		# what is sung; only the 𝄆 𝄇 signs come out.
		'section': 'Official lyrics',
		'poem': 0,
		'take': [[2, 9], [11, 21]],
		'stanzas': 2,
		'pd': ('words José de la Torre Ugarte, died 1831; music José Bernardo '
		       'Alcedo, died 1878 — the earliest pair of death years in this file'),
	},
	'id': {
		'lang': 'id',
		'wiki': 'id',
		'site': 'wikipedia',
		'page': 'Indonesia Raya',
		# three <poem> blocks, the same words in three spellings: the 1928
		# original, the Soewandi of 1947, and the modern one, which is the third
		# and the only one that matches the score's own underlay. Stanza I and the
		# refrain are what the recordings play, and what `take` carves out — the
		# other two stanzas are sung only in the three-stanza recordings
		'poem': 2,
		'take': [[2, 15], [47, 52]],
		'stanzas': 2,
		'pd': ('words and music Wage Rudolf Supratman, died 1938 — the same man '
		       'wrote both, so one death year settles the whole anthem. Published '
		       '1928, which puts it out in the United States as well'),
	},
	'au': {
		'lang': 'en',
		'wiki': 'en',
		'site': 'wikipedia',
		'page': 'Advance Australia Fair',
		# the official anthem is two stanzas, and the article sets them as two
		# <poem> blocks side by side, each opening with a bold numeral the `take`
		# steps over. Both blocks are wanted, so `poem` is a list
		'poem': [0, 1],
		'take': [[2, 11], [13, 22]],
		'stanzas': 2,
		'expect_lines': 10,
		'pd': ('words Peter Dodds McCormick, died 1916. The official text is his, '
		       'twice amended by the state that adopted it — "Australia\'s sons" '
		       'became "Australians all" on adoption in 1984, and "young" became '
		       '"one" by proclamation in 2021 — and neither amendment is somebody\'s '
		       'copyright, the same ground as Canada\'s 2018 Act above'),
	},
	'nl': {
		'lang': 'nl',
		'wiki': 'nl',
		# nl.wikisource sets the fifteen stanzas in a two-column table (1932 spelling
		# beside the 1581 original), which this reader cannot take apart; the
		# Wikipedia article carries the same 1932 text as its first <poem> block
		'site': 'wikipedia',
		'page': 'Wilhelmus',
		'poem': 0,
		# every stanza in that block opens with a bold heading line — '''Eerste
		# couplet''' — which survives the markup strip as a ninth line; `take`
		# carves the eight verse lines of the first stanza out from under it.
		# The anthem is that first stanza; custom sometimes adds the sixth, and
		# the other thirteen are the poem, not the anthem
		'take': [[2, 9]],
		'stanzas': 1,
		'expect_lines': 8,
		'pd': ('words 1568–1572, attributed to Philips of Marnix, died 1598, or Dirck '
		       'Coornhert, died 1590 — public domain whoever wrote them; the tune is a '
		       '1568 contrafactum set by Adriaen Valerius, died 1625'),
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
		# leading colons indent a line on the page; Indonesia's article uses them to
		# set the middle four lines of each stanza in from the rest. They are
		# layout, not text, and no verse line legitimately opens with one
		line = re.sub(r'^:+\s*', '', line)
		line = re.sub(r'\[\[[^\]|]*\|([^\]]*)\]\]', r'\1', line)  # [[X|Y]] -> Y
		line = re.sub(r'\[\[([^\]]*)\]\]', r'\1', line)           # [[X]] -> X
		"""
		Footnotes and wrappers, which look alike and mean the opposite.
		
		A verse line can be *wrapped* in a template whose content is the verse —
		{{lang|la|O felix Roma}} — and it can carry a *note* whose content is not
		verse at all: Bjørnson's first stanza ends
		
		    drømmer{{efn|Often written as {{lang|no|drømme}}.<ref .../>}} på vår jord.
		
		where the efn wraps a lang, so unwrapping lang first would leave the efn's
		`}}` orphaned and the four words after it would go with the wrong rule. So:
		refs go, then notes innermost-first, then wrappers, then anything still
		left open — which is a note running past the end of the line, as the
		Vatican's Latin has.
		"""
		line = re.sub(r'<ref[^>]*/>', '', line)
		line = re.sub(r'<ref[^>]*>.*?</ref>', '', line, flags=re.S)
		line = re.sub(r'<ref[^>]*>.*$', '', line)
		while True:
			# discarded whole: notes, citations, and Wikisource's printed line numbers
			shorter = re.sub(r'\{\{(?:efn|refn|sfn|cbignore|cite\b|R\|)[^{}]*\}\}', '', line,
			                 flags=re.I)
			# unwrapped: everything else, whose content is the verse itself
			shorter = re.sub(r'\{\{(?!efn|refn|sfn|cbignore|cite\b|R\|)[^{}|]*\|([^{}]*)\}\}',
			                 r'\1', shorter, flags=re.I)
			if shorter == line:
				break
			line = shorter
		line = re.sub(r'\{\{(?:lang\|[a-z-]+\||small\||yesitalic\||italic=no\|)+', '', line)
		line = re.sub(r'\{\{.*$', '', line)
		line = line.replace('}}', '')
		# Wikisource often ends each verse line with an explicit <br>. Left in, it
		# lands in the txt file as literal markup — which is what happened to the
		# Danish lyrics before this, and had to be stripped by hand.
		line = re.sub(r'</?br\s*/?>', '', line, flags=re.I)
		# repeat signs (𝄆 𝄇) mark how a stanza is sung, not what is sung
		line = re.sub(r'[\U0001D106\U0001D107]', '', line)
		# markup removed mid-line leaves doubled spaces behind — Canada's third
		# line has one where the 2018 amendment was spliced in
		line = re.sub(r'\s{2,}', ' ', line)
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
		# any heading level: Peru's official words sit under a === subheading
		m = re.search(rf'^={{2,}}\s*{re.escape(spec["section"])}\s*={{2,}}\s*$', src, re.M)
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

	# Two official versions means two entries, keyed `code:lang` — the Vatican sings
	# its anthem in Italian and in Latin, and each has its own page, shape and term.
	code = args.code.split(':')[0]
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
	out = LYRICS / code / f'{spec["lang"]}.txt'
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
