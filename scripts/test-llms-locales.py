"""Validate plain-text locale guides; --live verifies deployed bytes and headers."""
import argparse
import re
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

parser = argparse.ArgumentParser()
parser.add_argument('--live', action='store_true')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
locales = ('de', 'fr', 'it', 'en')
paths = ['llms.txt'] + [f'{lang}/llms.txt' for lang in locales]
assert (root / 'public/llms.txt').read_bytes() == (root / 'public/de/llms.txt').read_bytes()
for path in paths:
    expected = (root / 'public' / path).read_bytes()
    text = expected.decode('utf-8')
    assert text.startswith('# Cleverli\n\n> '), path
    assert 'Lehrplan 21' in text and 'PER' in text and 'Piano di studio' in text, path
    assert not any(x in text for x in ['13’000', '13,000', '13 000', 'ß']), path
    links = re.findall(r'\]\((https://[^)]+)\)', text)
    assert len(links) == 24 and len(set(links)) == 24, (path, len(links))
    for locale in locales:
        assert f'https://www.cleverli.ch/{locale}/llms.txt' in links
    for link in links:
        u = urlparse(link)
        assert u.netloc == 'www.cleverli.ch'
        assert not re.match(r'^/(de|fr|it|en)/', u.path) or u.path.endswith('/llms.txt'), link
    assert all(any(urlparse(link).path == '/lehrplanbezug' and urlparse(link).fragment == f'klasse-{n}' for link in links) for n in range(1, 7)), path
    assert all(': ' in line for line in text.splitlines() if line.startswith('- [') and '/llms.txt)' not in line), path
    assert all(term in text for term in ['CHF 9.90', 'CHF 99', 'hello@cleverli.ch', 'Alexandra Gosteli Digital Solutions']), path
    assert 5000 < len(text) < 12000, path
    if args.live:
        with urllib.request.urlopen('https://www.cleverli.ch/' + path, timeout=60) as response:
            assert response.status == 200
            assert response.headers.get_content_type() == 'text/plain'
            assert response.read() == expected, path
    print('PASS', path, '24 official links', 'live byte parity' if args.live else 'local')
