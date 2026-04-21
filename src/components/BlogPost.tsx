import PhotoCarousel from './PhotoCarousel';
import type { BlogPost as BlogPostData } from '../data/blogPosts';

interface Props {
  post: BlogPostData;
}

export default function BlogPost({ post }: Props) {
  return (
    <article className="blog-post card" id={post.id}>
      <header className="blog-post-header">
        <h2 className="blog-post-title">{post.title}</h2>
        <div className="blog-post-meta">
          {post.location && <span className="blog-post-location">{post.location}</span>}
          {post.location && <span className="blog-post-sep">·</span>}
          <span className="blog-post-date">{post.date}</span>
        </div>
      </header>

      <PhotoCarousel photos={post.photos} />

      {post.caption && <p className="blog-post-caption">{post.caption}</p>}
    </article>
  );
}
