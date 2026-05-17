import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import SEO from '../components/SEO';

export default function Blog() {
  return (
    <div className="page blog-page">
      <SEO
        title="Blog"
        description="Notes on cryptography, algorithms, math, and other things I find interesting."
        path="/blog"
      />
      <div className="blog-header-row">
        <h1 className="page-title">Blog</h1>
        <a
          href="/rss.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="rss-subscribe"
          title="Subscribe via RSS"
          aria-label="Subscribe via RSS"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4 4v3a13 13 0 0 1 13 13h3A16 16 0 0 0 4 4zm0 7v3a6 6 0 0 1 6 6h3a9 9 0 0 0-9-9zm2.5 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
          </svg>
          <span>RSS</span>
        </a>
      </div>
      <p className="blog-intro">
        Notes on things I find interesting. <a href="/rss.xml" target="_blank" rel="noopener noreferrer">Subscribe via RSS</a> in a reader like Feedly, Reeder, or NetNewsWire.
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
