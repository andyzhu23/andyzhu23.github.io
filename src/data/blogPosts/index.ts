import { type BlogPost, parseBlogDate } from './types';
import EllipticCurves, { meta as ellipticCurvesMeta } from './ellipticCurves';
import Fri, { meta as friMeta } from './fri';
import DiscreteFourierTransform, { meta as dftMeta } from './discreteFourierTransform';
import CambridgeUndergrad, { meta as cambridgeUndergradMeta } from './cambridgeUndergrad';

export type { BlogPost, BlogPostMeta } from './types';

const rawPosts: BlogPost[] = [
  { ...ellipticCurvesMeta, Component: EllipticCurves },
  { ...friMeta, Component: Fri },
  { ...dftMeta, Component: DiscreteFourierTransform },
  { ...cambridgeUndergradMeta, Component: CambridgeUndergrad },
];

export const blogPosts: BlogPost[] = [...rawPosts].sort(
  (a, b) => parseBlogDate(b.date).getTime() - parseBlogDate(a.date).getTime(),
);

export function findBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}
