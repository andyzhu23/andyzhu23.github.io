import PhotoPost from '../components/PhotoPost';
import { photoPosts } from '../data/photoPosts';

export default function Photos() {
  return (
    <div className="page photos-page">
      <div className="photos-hero">
        <img src="/images/photos-hero.jpg" alt="" className="photos-hero-img" />
      </div>
      <h1 className="page-title">Photos</h1>
      <p className="photos-intro">
        A photo feed — treat this like Instagram. I am trying to take a break from Instagram but would still like to have a place to document my life.
      </p>
      <div className="photos-feed">
        {photoPosts.map(post => (
          <PhotoPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
