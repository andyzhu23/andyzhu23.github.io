// Photo feed posts.
// Photo filenames refer to /public/images/posts/<name>.jpg.
// Regenerate those outputs with `npm run optimize-photos`.
// Posts are grouped by year in sibling files; insertion order within a year
// doesn't matter — the concatenated array is sorted newest-first on export
// by parsing each post's `date` field. Accepts "April 16, 2026",
// "March 21–25, 2026", "June–September 2023", "December 2024", etc.

import { type PhotoPost, parseSortDate } from './types';
import { posts2023 } from './2023';
import { posts2024 } from './2024';
import { posts2025 } from './2025';
import { posts2026 } from './2026';

export type { PhotoPost };

const rawPosts: PhotoPost[] = [
  ...posts2023,
  ...posts2024,
  ...posts2025,
  ...posts2026,
];

export const photoPosts: PhotoPost[] = [...rawPosts].sort(
  (a, b) => parseSortDate(b.date).getTime() - parseSortDate(a.date).getTime(),
);
