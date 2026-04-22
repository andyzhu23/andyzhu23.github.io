import { useEffect, useRef, useState } from 'react';
import PhotoCarousel from './PhotoCarousel';
import type { PhotoPost as PhotoPostData } from '../data/photoPosts';

interface Props {
  post: PhotoPostData;
}

export default function PhotoPost({ post }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: '1000px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);

  return (
    <article ref={ref} className="photo-post card" id={post.id}>
      <header className="photo-post-header">
        <h2 className="photo-post-title">{post.title}</h2>
        <div className="photo-post-meta">
          {post.location && <span className="photo-post-location">{post.location}</span>}
          {post.location && <span className="photo-post-sep">·</span>}
          <span className="photo-post-date">{post.date}</span>
        </div>
      </header>

      {visible ? (
        <PhotoCarousel photos={post.photos} />
      ) : (
        <div className="photo-carousel" aria-hidden="true" />
      )}

      {post.caption && <p className="photo-post-caption">{post.caption}</p>}
    </article>
  );
}
