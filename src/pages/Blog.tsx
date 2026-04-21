import BlogPost from '../components/BlogPost';
import { blogPosts } from '../data/blogPosts';

export default function Blog() {
  return (
    <div className="page blog-page">
      <h1 className="page-title">Blog</h1>
      <p className="blog-intro">A photo feed — recent trips, events, and moments.</p>
      <div className="blog-feed">
        {blogPosts.map(post => (
          <BlogPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
