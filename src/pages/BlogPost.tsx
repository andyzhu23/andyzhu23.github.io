import { Link, useParams } from 'react-router-dom';
import { findBlogPost } from '../data/blogPosts';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? findBlogPost(slug) : undefined;

  if (!post) {
    return (
      <div className="page blog-post-page">
        <h1 className="page-title">Not found</h1>
        <p>That post doesn't exist (yet).</p>
        <Link to="/blog" className="blog-back-link">← Back to blog</Link>
      </div>
    );
  }

  const { Component } = post;
  return (
    <div className="page blog-post-page">
      <Link to="/blog" className="blog-back-link">← Back to blog</Link>
      <header className="blog-post-header">
        <h1 className="blog-post-title">{post.title}</h1>
        <div className="blog-post-meta">
          <span className="date">{post.date}</span>
          <span className="dot">·</span>
          <span>{post.readingMinutes} min read</span>
        </div>
        <div className="tag-list">
          {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      </header>
      <Component />
    </div>
  );
}
