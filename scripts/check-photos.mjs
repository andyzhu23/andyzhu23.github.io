#!/usr/bin/env node
// Validate that every photo referenced in src/data/photoPosts/ exists on disk,
// flag orphans/oversized outputs/duplicate bases. Fails the build on missing
// files; everything else is a warning.

import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const POSTS_DIR = join(ROOT, 'src/data/photoPosts');
const IMG_DIR = join(ROOT, 'public/images/posts');

const SIZE_WARN_BYTES = 600 * 1024;

function collectReferencedBases() {
  const files = readdirSync(POSTS_DIR).filter((f) => /^\d{4}\.ts$/.test(f));
  const refs = new Map();
  for (const file of files) {
    const src = readFileSync(join(POSTS_DIR, file), 'utf8');
    const postBlocks = src.split(/^\s*\{\s*$/m);
    for (const block of postBlocks) {
      const idMatch = block.match(/id:\s*['"]([^'"]+)['"]/);
      const photosMatch = block.match(/photos:\s*\[([\s\S]*?)\]/);
      if (!idMatch || !photosMatch) continue;
      const id = idMatch[1];
      const bases = [...photosMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]);
      for (const b of bases) {
        if (!refs.has(b)) refs.set(b, []);
        refs.get(b).push(id);
      }
    }
  }
  return refs;
}

function main() {
  const refs = collectReferencedBases();
  const onDisk = new Set(
    readdirSync(IMG_DIR)
      .filter((f) => f.endsWith('.jpg'))
      .map((f) => f.slice(0, -'.jpg'.length)),
  );

  const missing = [];
  const oversized = [];
  const duplicates = [];

  for (const [base, postIds] of refs) {
    if (!onDisk.has(base)) {
      missing.push({ base, postIds });
    } else {
      const size = statSync(join(IMG_DIR, `${base}.jpg`)).size;
      if (size > SIZE_WARN_BYTES) oversized.push({ base, size });
    }
    if (postIds.length > 1) duplicates.push({ base, postIds });
  }

  const orphans = [...onDisk].filter((b) => !refs.has(b)).sort();

  let failed = false;

  if (missing.length) {
    failed = true;
    console.error(`\n✗ ${missing.length} referenced photo(s) missing from public/images/posts/:`);
    for (const { base, postIds } of missing) {
      console.error(`   ${base}.jpg  (in ${postIds.join(', ')})`);
    }
  }

  if (oversized.length) {
    console.warn(`\n⚠ ${oversized.length} file(s) over ${(SIZE_WARN_BYTES / 1024).toFixed(0)} KB — re-run optimize-photos?`);
    for (const { base, size } of oversized) {
      console.warn(`   ${base}.jpg  ${(size / 1024).toFixed(0)} KB`);
    }
  }

  if (duplicates.length) {
    console.warn(`\n⚠ ${duplicates.length} base(s) referenced by more than one post (copy-paste typo?):`);
    for (const { base, postIds } of duplicates) {
      console.warn(`   ${base}  → ${postIds.join(', ')}`);
    }
  }

  if (orphans.length) {
    console.warn(`\n⚠ ${orphans.length} orphan file(s) in public/images/posts/ not referenced by any post:`);
    for (const base of orphans) console.warn(`   ${base}.jpg`);
  }

  const refCount = refs.size;
  const diskCount = onDisk.size;
  console.log(`\nchecked ${refCount} referenced, ${diskCount} on disk, ${missing.length} missing, ${orphans.length} orphans, ${oversized.length} oversized`);

  if (failed) process.exit(1);
}

main();
