import { type BlogPost, parseBlogDate } from './types';
import EllipticCurves, { meta as ellipticCurvesMeta } from './ellipticCurves';

export type { BlogPost, BlogPostMeta } from './types';

const rawPosts: BlogPost[] = [
  { ...ellipticCurvesMeta, Component: EllipticCurves },
];

export const blogPosts: BlogPost[] = [...rawPosts].sort(
  (a, b) => parseBlogDate(b.date).getTime() - parseBlogDate(a.date).getTime(),
);

export function findBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}
