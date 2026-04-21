---
name: add-photos
description: Process raw photos from public/images/posts/tmp/ into web/thumb JPGs and add them as entries in src/data/photoPosts.ts. Trigger when the user says things like "add photos", "process photos in tmp", "add new photos to the photos section", or drops files into public/images/posts/tmp/.
---

# Add photos to the photo feed

Use this skill whenever the user drops raw photos into `public/images/posts/tmp/` and wants them processed into posts on the site. The workflow turns any HEIC/JPG/PNG originals into web + thumb JPGs and adds entries to `src/data/photoPosts.ts`.

## Inputs you should expect

- Raw files in `public/images/posts/tmp/` (HEIC, JPG, JPEG, PNG — any case).
- No metadata beyond what's in the image EXIF. Filenames are arbitrary (typically `IMG_####`).

## Output the site expects

- `public/images/posts/web/<base>.jpg` (max side 1600, quality 82)
- `public/images/posts/thumb/<base>.jpg` (max side 480, quality 75)
- One or more entries appended to the `photoPosts` array in `src/data/photoPosts.ts`

The `<base>` is the original filename without extension, with spaces stripped. Filenames are referenced by `<base>` only — the components append `.jpg` themselves.

## Step-by-step

### 1. Inspect the tmp files

```bash
ls public/images/posts/tmp/
```

For each file, grab the creation date and dimensions so you can group them:

```bash
cd public/images/posts/tmp && \
  for f in *; do
    echo "=== $f ==="
    sips -g creation -g pixelWidth -g pixelHeight "$f" 2>/dev/null | tail -3
  done
```

`sips` is pre-installed on macOS and reads HEIC EXIF. If `creation` is `<nil>`, fall back to filename clues or ask the user.

### 2. View each photo

HEIC files can't be rendered by the Read tool directly. Convert every file (HEIC and JPG) to a small preview in /tmp first, then Read each one to understand content:

```bash
mkdir -p /tmp/photo-previews && \
  cd public/images/posts/tmp && \
  for f in *; do
    sips -s format jpeg -Z 800 "$f" --out "/tmp/photo-previews/${f%.*}.jpg" > /dev/null 2>&1
  done
```

Then `Read` each `/tmp/photo-previews/<base>.jpg` to identify subjects (food, landscape, building, people, etc.). Combine visual content + EXIF date + any user hints to pick a title, location, and caption.

### 3. Group photos into posts

Cluster by date + location + theme. A post usually spans one day or a short trip.

Before creating a new post, read the existing `photoPosts` array in `src/data/photoPosts.ts` and look for a post that already covers the same trip/day — extend that post's `photos` array instead of creating a near-duplicate.

### 4. Copy raws into photos-raw/

The optimizer reads from `photos-raw/`, not from `tmp/`. Copy the originals over so they're retained and regenerable:

```bash
cp public/images/posts/tmp/*.HEIC photos-raw/ 2>/dev/null
cp public/images/posts/tmp/*.JPG photos-raw/ 2>/dev/null
cp public/images/posts/tmp/*.jpg photos-raw/ 2>/dev/null
cp public/images/posts/tmp/*.jpeg photos-raw/ 2>/dev/null
cp public/images/posts/tmp/*.png photos-raw/ 2>/dev/null
```

### 5. Run the optimizer

```bash
npm run optimize-photos
```

This reads every file in `photos-raw/`, writes `web/<base>.jpg` and `thumb/<base>.jpg` to `public/images/posts/`, and is idempotent — already-fresh outputs are skipped. It converts HEIC via `sips` internally, then pipes through `sharp` + `mozjpeg`.

Verify the expected outputs landed:

```bash
ls public/images/posts/web/ | grep -E "(pattern matching your new bases)"
```

### 6. Update src/data/photoPosts.ts

Append new entries to the `rawPosts` array — insertion order doesn't matter. The file sorts `rawPosts` by parsing the `date` field before exporting as `photoPosts`, so the feed always shows newest-first regardless of where you put the entry. Each entry matches this interface:

```ts
{
  id: 'kebab-case-slug',          // unique; date-prefixed helps sorting mentally
  title: 'Short headline',         // sentence case, <= ~35 chars
  date: 'Month D, YYYY',           // or a range like 'Month D–D, YYYY'
  location: 'City, Region',        // be specific when you can
  caption: 'One or two sentences.', // personal, first-person-ish, low-key
  photos: ['IMG_XXXX', 'IMG_YYYY'], // base filenames, no extension, no dir
}
```

Style notes pulled from existing posts:
- Captions are short, warm, not promotional. Details over adjectives ("Cantonese night with the usual suspects", "rare ribeye and scallops — a small celebration").
- Don't narrate the obvious. Pick one specific thing about the day.
- Order `photos` so the best/cover shot is first — it's the thumbnail in the feed.

The `date` parser supports these formats (and uses the latest point in any range for sorting):
- `"April 16, 2026"` — single day
- `"March 21–25, 2026"` — day range within a month
- `"August 1–4, 2025"` — short range
- `"June–September 2023"` — month range, no specific day
- `"December 2024"` — whole month

### 7. Verify — including rotation

Run the build to catch type errors and confirm no broken references:

```bash
npm run build
```

**Then open each new web JPG with Read and visually confirm orientation.** This is a known gotcha: the optimizer can double-apply EXIF orientation on portrait-shot HEICs (sips rotates during HEIC→JPEG conversion, then sharp's `.rotate()` applies the stale orientation tag a second time), producing sideways or upside-down output. Landscape-shot HEICs and iPhone JPGs are generally fine.

If a file is rotated wrong, fix it in place with `sips -r <deg>` (must be run from `public/images/posts/`):

```bash
cd public/images/posts
sips -r 90  web/IMG_XXXX.jpg thumb/IMG_XXXX.jpg > /dev/null   # 90° clockwise
sips -r 180 web/IMG_XXXX.jpg thumb/IMG_XXXX.jpg > /dev/null   # upside-down
sips -r 270 web/IMG_XXXX.jpg thumb/IMG_XXXX.jpg > /dev/null   # 90° counter-clockwise
```

Re-read the file afterwards to confirm. Apply the same rotation to both `web/` and `thumb/` so the feed and lightbox stay consistent.

If the user is iterating visually, suggest `npm run dev` instead.

### 8. Clean up

Remove the tmp directory once the photos are safely in `photos-raw/` and `public/images/posts/{web,thumb}/`:

```bash
rm -rf public/images/posts/tmp
```

## Common pitfalls

- **HEIC files never reach Read directly.** Always convert to JPG previews in `/tmp/` before trying to view them.
- **Portrait HEICs often come out rotated.** See step 7 — always Read the web/ outputs and fix with `sips -r` before declaring done.
- **Don't hand-edit files in `public/images/posts/web/` or `/thumb/`.** They're regenerated from `photos-raw/` — but rotation fixes via `sips -r` are the exception, since re-running the optimizer would just re-introduce the double-rotation bug.
- **Spaces in filenames get stripped** by the optimizer (`FullSizeRender 2.HEIC` → `FullSizeRender2.jpg`). Reference the stripped name in `photoPosts.ts`.
- **Date = nil in EXIF** usually means the photo was shared over an app that stripped metadata. Check filename ordering or ask the user which trip it belongs to rather than guessing.
- **Landscape vs. portrait matters** for the grid layout — mixing orientations within a post is fine, but keep the hero photo (first in array) as a strong standalone shot.
- **Don't invent locations.** If you can't tell from the image and no EXIF GPS is available, use a broader region ("British Columbia" instead of a specific trail name) or ask.

## If user asks to just process (no posts)

Skip step 6. Run steps 1, 4, 5, 7, 8 and tell them which bases are now available to reference.
