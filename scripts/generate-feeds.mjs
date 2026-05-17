#!/usr/bin/env node
// Read blog post metadata from src/data/blogPosts/*.tsx and emit
// public/rss.xml, public/atom.xml, public/sitemap.xml. Run before vite build.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const POSTS_DIR = join(ROOT, 'src/data/blogPosts');
const OUT_DIR = join(ROOT, 'public');
const SITE_URL = 'https://andyzhu23.github.io';
const AUTHOR = 'Andy Zhu';
const SITE_TITLE = "Andy Zhu's blog";
const SITE_DESCRIPTION = 'Notes on cryptography, algorithms, math, and other things I find interesting.';

const STATIC_ROUTES = [
  { path: '/', changefreq: 'monthly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/experience', changefreq: 'monthly', priority: '0.7' },
  { path: '/projects', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog', changefreq: 'weekly', priority: '0.9' },
  { path: '/photos', changefreq: 'monthly', priority: '0.6' },
  { path: '/interests', changefreq: 'monthly', priority: '0.5' },
];

const MONTHS = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

function parseBlogDate(s) {
  const yearMatch = s.match(/\b(\d{4})\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : 1970;
  const monthMatch = s.match(/January|February|March|April|May|June|July|August|September|October|November|December/i);
  const month = monthMatch ? MONTHS[monthMatch[0].toLowerCase()] : 0;
  const dayMatch = s.match(/\b(\d{1,2})\b/);
  const day = dayMatch ? parseInt(dayMatch[1], 10) : 1;
  return new Date(Date.UTC(year, month, day, 12, 0, 0));
}

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function extractMeta(src, file) {
  // Match the `meta` export block — a single object literal, may span lines.
  const m = src.match(/export\s+const\s+meta\s*:\s*BlogPostMeta\s*=\s*\{([\s\S]*?)\n\}\s*;/);
  if (!m) throw new Error(`${file}: could not locate \`export const meta\` block`);
  const body = m[1];

  const field = (name) => {
    // Match `name: '...'` or `name: "..."` allowing newline-folded strings.
    // We support both quote styles and concatenation isn't expected.
    const re = new RegExp(`${name}\\s*:\\s*(['"])((?:\\\\.|(?!\\1)[\\s\\S])*?)\\1`);
    const x = body.match(re);
    return x ? x[2].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n') : null;
  };

  const tagsMatch = body.match(/tags\s*:\s*\[([\s\S]*?)\]/);
  const tags = tagsMatch
    ? [...tagsMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1])
    : [];

  const readingMatch = body.match(/readingMinutes\s*:\s*(\d+)/);
  const readingMinutes = readingMatch ? parseInt(readingMatch[1], 10) : 0;

  const slug = field('slug');
  const title = field('title');
  const date = field('date');
  const description = field('description');
  if (!slug || !title || !date || !description) {
    throw new Error(`${file}: meta is missing one of slug/title/date/description`);
  }
  return { slug, title, date, description, tags, readingMinutes, _file: file };
}

function collectPosts() {
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.tsx'));
  const posts = [];
  for (const f of files) {
    const src = readFileSync(join(POSTS_DIR, f), 'utf8');
    posts.push(extractMeta(src, f));
  }
  posts.sort((a, b) => parseBlogDate(b.date).getTime() - parseBlogDate(a.date).getTime());
  return posts;
}

function postUrl(slug) {
  return `${SITE_URL}/blog/${slug}`;
}

function rfc822(d) {
  // RSS pubDate format, e.g. "Sun, 24 Apr 2026 12:00:00 GMT"
  return d.toUTCString();
}

function iso(d) {
  return d.toISOString();
}

function buildRss(posts) {
  const lastBuild = rfc822(new Date());
  const items = posts.map((p) => {
    const url = postUrl(p.slug);
    const pubDate = rfc822(parseBlogDate(p.date));
    const categories = p.tags.map((t) => `      <category>${xmlEscape(t)}</category>`).join('\n');
    return `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${xmlEscape(p.description)}</description>
${categories}
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(SITE_TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${xmlEscape(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

function buildAtom(posts) {
  const updated = posts.length ? iso(parseBlogDate(posts[0].date)) : iso(new Date());
  const entries = posts.map((p) => {
    const url = postUrl(p.slug);
    const when = iso(parseBlogDate(p.date));
    const categories = p.tags.map((t) => `    <category term="${xmlEscape(t)}" />`).join('\n');
    return `  <entry>
    <title>${xmlEscape(p.title)}</title>
    <link href="${url}" />
    <id>${url}</id>
    <updated>${when}</updated>
    <published>${when}</published>
    <summary>${xmlEscape(p.description)}</summary>
${categories}
  </entry>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${xmlEscape(SITE_TITLE)}</title>
  <link href="${SITE_URL}/blog" />
  <link href="${SITE_URL}/atom.xml" rel="self" type="application/atom+xml" />
  <id>${SITE_URL}/</id>
  <updated>${updated}</updated>
  <author><name>${xmlEscape(AUTHOR)}</name></author>
  <subtitle>${xmlEscape(SITE_DESCRIPTION)}</subtitle>
${entries}
</feed>
`;
}

function buildSitemap(posts) {
  const today = iso(new Date()).slice(0, 10);
  const urls = [];
  for (const r of STATIC_ROUTES) {
    urls.push(`  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`);
  }
  for (const p of posts) {
    const when = iso(parseBlogDate(p.date)).slice(0, 10);
    urls.push(`  <url>
    <loc>${postUrl(p.slug)}</loc>
    <lastmod>${when}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

function main() {
  const posts = collectPosts();
  writeFileSync(join(OUT_DIR, 'rss.xml'), buildRss(posts));
  writeFileSync(join(OUT_DIR, 'atom.xml'), buildAtom(posts));
  writeFileSync(join(OUT_DIR, 'sitemap.xml'), buildSitemap(posts));
  console.log(`generated rss.xml, atom.xml, sitemap.xml (${posts.length} post${posts.length === 1 ? '' : 's'})`);
}

main();
