import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';

export default function Blog() {
  return (
    <div className="page blog-page">
      <h1 className="page-title">Blog</h1>
      <p className="blog-intro">
        Notes on things I find interesting.
      </p>
      <ul className="blog-index">
        {blogPosts.map(post => (
          <li key={post.slug} className="blog-index-item card">
            <Link to={`/blog/${post.slug}`} className="blog-index-link">
              <div className="blog-index-header">
                <h2>{post.title}</h2>
                <span className="date">{post.date}</span>
              </div>
              <p className="blog-index-description">{post.description}</p>
              <div className="blog-index-meta">
                <span>{post.readingMinutes} min read</span>
                <div className="tag-list">
                  {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
