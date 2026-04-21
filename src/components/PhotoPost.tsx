import PhotoCarousel from './PhotoCarousel';
import type { PhotoPost as PhotoPostData } from '../data/photoPosts';

interface Props {
  post: PhotoPostData;
}

export default function PhotoPost({ post }: Props) {
  return (
    <article className="photo-post card" id={post.id}>
      <header className="photo-post-header">
        <h2 className="photo-post-title">{post.title}</h2>
        <div className="photo-post-meta">
          {post.location && <span className="photo-post-location">{post.location}</span>}
          {post.location && <span className="photo-post-sep">·</span>}
          <span className="photo-post-date">{post.date}</span>
        </div>
      </header>

      <PhotoCarousel photos={post.photos} />

      {post.caption && <p className="photo-post-caption">{post.caption}</p>}
    </article>
  );
}
