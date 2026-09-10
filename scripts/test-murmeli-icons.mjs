import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const manifest = JSON.parse(readFileSync('public/site.webmanifest', 'utf8'));
assert.equal(manifest.id, '/?source=pwa');
assert.equal(manifest.start_url, '/');
assert.equal(manifest.scope, '/');
assert.equal(manifest.display, 'standalone');
assert.equal(manifest.icons.length, 4);
for (const purpose of ['any', 'maskable']) {
  for (const size of [192, 512]) {
    const entry = manifest.icons.find(x => x.purpose === purpose && x.sizes === `${size}x${size}`);
    assert.ok(entry);
    assert.match(entry.src, /^\/murmeli-.*-v3-/);
    const png = readFileSync(`public${entry.src}`);
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(png.readUInt32BE(16), size);
    assert.equal(png.readUInt32BE(20), size);
    assert.equal(png[25], 2, 'Opaque RGB assets, no transparent launcher padding');
  }
}
for (const shortcut of manifest.shortcuts) {
  assert.equal(shortcut.icons[0].src, '/murmeli-icon-v3-192.png');
}
const layout = readFileSync('src/app/layout.tsx', 'utf8');
for (const file of ['murmeli-favicon-v3.png', 'murmeli-apple-v3.png', 'murmeli-icon-v3-192.png', 'murmeli-icon-v3-512.png']) {
  assert.ok(layout.includes(file));
}
assert.deepEqual(readFileSync('src/app/favicon.ico'), readFileSync('public/favicon.ico'));
console.log('PASS: four opaque versioned PWA icons, maskable/any separation, dimensions, Apple/favicon metadata, stable app identity and shortcuts.');
