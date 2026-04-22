#!/usr/bin/env node
// Convert/resize raw photos in /photos-raw/ to web-sized JPGs under public/images/posts/.
// Idempotent: skips outputs newer than source.

import { readdir, stat, mkdir, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import sharp from 'sharp';

const execFileP = promisify(execFile);

const ROOT = new URL('..', import.meta.url).pathname;
const SRC_DIR = join(ROOT, 'photos-raw');
const OUT_DIR = join(ROOT, 'public/images/posts');

const SKIP_NAMES = new Set(['.DS_Store', '朱哲远.png']);
const PHOTO_EXT = new Set(['.jpg', '.jpeg', '.png', '.heic']);

const MAX_SIDE = 1600;
const QUALITY = 82;

async function ensureDir(p) {
  await mkdir(p, { recursive: true });
}

async function isFresh(srcStat, outPath) {
  if (!existsSync(outPath)) return false;
  const s = await stat(outPath);
  return s.mtimeMs >= srcStat.mtimeMs;
}

async function heicToJpegBuffer(srcPath) {
  const tmp = join(tmpdir(), `heic-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`);
  try {
    await execFileP('sips', ['-s', 'format', 'jpeg', srcPath, '--out', tmp]);
    const buf = await sharp(tmp).toBuffer();
    return buf;
  } finally {
    if (existsSync(tmp)) await unlink(tmp).catch(() => {});
  }
}

async function processOne(srcPath) {
  const rawBase = basename(srcPath, extname(srcPath));
  const base = rawBase.replace(/\s+/g, '');
  const ext = extname(srcPath).toLowerCase();
  const out = join(OUT_DIR, `${base}.jpg`);

  const srcStat = await stat(srcPath);
  if (await isFresh(srcStat, out)) return { skipped: true, base };

  let pipeline;
  if (ext === '.heic') {
    const buf = await heicToJpegBuffer(srcPath);
    pipeline = () => sharp(buf).rotate();
  } else {
    pipeline = () => sharp(srcPath).rotate();
  }

  await pipeline()
    .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(out);

  return { skipped: false, base };
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`Source directory not found: ${SRC_DIR}`);
    process.exit(1);
  }
  await ensureDir(OUT_DIR);

  const entries = await readdir(SRC_DIR);
  const photos = entries.filter((name) => {
    if (SKIP_NAMES.has(name)) return false;
    return PHOTO_EXT.has(extname(name).toLowerCase());
  });

  let done = 0, skipped = 0, failed = 0;
  for (const name of photos) {
    const srcPath = join(SRC_DIR, name);
    try {
      const { skipped: wasSkipped } = await processOne(srcPath);
      if (wasSkipped) skipped++; else done++;
      const tag = wasSkipped ? 'skip' : 'done';
      process.stdout.write(`[${tag}] ${name}\n`);
    } catch (err) {
      failed++;
      process.stderr.write(`[fail] ${name}: ${err.message}\n`);
    }
  }
  console.log(`\nProcessed ${done}, skipped ${skipped}, failed ${failed}, total ${photos.length}`);
}

main();
