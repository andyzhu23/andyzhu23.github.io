import { useCallback, useRef, useState } from 'react';

interface PhotoCarouselProps {
  photos: string[];
}

const SWIPE_THRESHOLD = 40;

export default function PhotoCarousel({ photos }: PhotoCarouselProps) {
  const [active, setActive] = useState(0);
  const pointerStartX = useRef<number | null>(null);

  const go = useCallback((next: number) => {
    setActive((next + photos.length) % photos.length);
  }, [photos.length]);

  const prev = () => go(active - 1);
  const next = () => go(active + 1);

  const onPointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    const dx = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) next(); else prev();
    }
  };

  return (
    <div className="photo-carousel">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${active * 100}%)` }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { pointerStartX.current = null; }}
      >
        {photos.map((photo, i) => {
          const near = Math.abs(i - active) <= 1;
          return (
            <div key={photo} className="carousel-slide">
              <img
                src={`/images/posts/${photo}.jpg`}
                alt=""
                loading={near ? 'eager' : 'lazy'}
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            className="carousel-arrow carousel-arrow-left"
            onClick={prev}
            aria-label="Previous photo"
          >‹</button>
          <button
            type="button"
            className="carousel-arrow carousel-arrow-right"
            onClick={next}
            aria-label="Next photo"
          >›</button>

          <div className="carousel-dots" role="tablist">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`carousel-dot${i === active ? ' active' : ''}`}
                onClick={() => go(i)}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>

          <div className="carousel-counter">{active + 1} / {photos.length}</div>
        </>
      )}
    </div>
  );
}
