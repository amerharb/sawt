#!/usr/bin/env python3
"""
Write each country's file hashes into its country file, or check them.

Every recording a country carries — `instrument`, `vocal`, `choral` — and its
`score` has a `hash`: the first twelve hex digits of the SHA-256 of the file it
names. The app puts that hash on the url as `?v=`, so a file that changes is a
new url, and both the browser's cache and the app's own IndexedDB fetch it
fresh. That is what lets a recording be re-cut or a melody corrected without
raising `cacheVersion` and re-downloading everything for everyone.

The hash is only as good as the last run of this tool, so:

    python3 tools/hash-sounds.py           # rewrite every hash that is stale
    python3 tools/hash-sounds.py --check   # change nothing; exit 1 if any is

`--check` also fails on a file a country names that is missing, and reports
files on disk that no country names. Run from apps/anthem.

    kind         file
    instrument   public/sound/instrument/<code>.aac
    vocal        public/sound/vocal/<code>.aac
    choral       public/sound/choral/<code>.aac
    score        public/melody/<code>.txt
"""
import glob
import hashlib
import os
import re
import sys

FILES = {
    'instrument': 'public/sound/instrument/{}.aac',
    'vocal': 'public/sound/vocal/{}.aac',
    'choral': 'public/sound/choral/{}.aac',
    'score': 'public/melody/{}.txt',
}
HASH_LEN = 12


def digest(path: str) -> str:
    with open(path, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()[:HASH_LEN]


def main() -> int:
    check = '--check' in sys.argv[1:]
    stale, missing, named = [], [], set()
    for src in sorted(glob.glob('src/countries/*.ts')):
        code = os.path.basename(src)[:-3]
        if code == 'Country':
            continue
        text = open(src, encoding='utf-8').read()
        out = text
        for kind, pattern in FILES.items():
            # the block opens at two tabs and closes at the next two-tab `},`
            m = re.search(rf'\n\t\t{kind}: \{{\n(.*?)\n\t\t\}},', out, re.S)
            if not m:
                continue
            path = pattern.format(code)
            named.add(path)
            if not os.path.exists(path):
                missing.append(f'{code}: {kind} names {path}, which does not exist')
                continue
            want = digest(path)
            h = re.search(r"\n\t\t\thash: '([0-9a-f]*)',", m.group(0))
            if not h:
                missing.append(f'{code}: {kind} has no `hash` line')
                continue
            if h.group(1) != want:
                stale.append(f'{code}: {kind} {h.group(1) or "(empty)"} -> {want}')
                start = m.start() + h.start()
                end = m.start() + h.end()
                out = out[:start] + f"\n\t\t\thash: '{want}'," + out[end:]
        if out != text and not check:
            open(src, 'w', encoding='utf-8').write(out)
    on_disk = set()
    for pattern in FILES.values():
        on_disk.update(glob.glob(pattern.format('*')))
    unnamed = sorted(on_disk - named)

    for line in missing:
        print('missing:', line)
    for line in stale:
        print('stale:  ' if check else 'wrote:  ', line)
    for path in unnamed:
        print('unnamed:', path, '— no country carries it')
    if check:
        bad = bool(missing or stale)
        print('hashes are stale' if bad else f'all hashes current ({len(named)} files)')
        return 1 if bad else 0
    print(f'{len(stale)} hash(es) written, {len(named)} files named')
    return 1 if missing else 0


if __name__ == '__main__':
    sys.exit(main())
