#!/usr/bin/env node
// Convert/resize raw photos in /photos-raw/ to web-sized JPGs under public/images/posts/{web,thumb}/.
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
const OUT_WEB = join(ROOT, 'public/images/posts/web');
const OUT_THUMB = join(ROOT, 'public/images/posts/thumb');

const SKIP_NAMES = new Set(['.DS_Store', '朱哲远.png']);
const PHOTO_EXT = new Set(['.jpg', '.jpeg', '.png', '.heic']);

const WEB_MAX = 1600;
const WEB_QUALITY = 82;
const THUMB_MAX = 480;
const THUMB_QUALITY = 75;

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
  const webOut = join(OUT_WEB, `${base}.jpg`);
  const thumbOut = join(OUT_THUMB, `${base}.jpg`);

  const srcStat = await stat(srcPath);
  const webFresh = await isFresh(srcStat, webOut);
  const thumbFresh = await isFresh(srcStat, thumbOut);
  if (webFresh && thumbFresh) return { skipped: true, base };

  let pipeline;
  if (ext === '.heic') {
    const buf = await heicToJpegBuffer(srcPath);
    pipeline = () => sharp(buf).rotate();
  } else {
    pipeline = () => sharp(srcPath).rotate();
  }

  await Promise.all([
    pipeline()
      .resize({ width: WEB_MAX, height: WEB_MAX, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: WEB_QUALITY, mozjpeg: true })
      .toFile(webOut),
    pipeline()
      .resize({ width: THUMB_MAX, height: THUMB_MAX, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: THUMB_QUALITY, mozjpeg: true })
      .toFile(thumbOut),
  ]);

  return { skipped: false, base };
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`Source directory not found: ${SRC_DIR}`);
    process.exit(1);
  }
  await ensureDir(OUT_WEB);
  await ensureDir(OUT_THUMB);

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
