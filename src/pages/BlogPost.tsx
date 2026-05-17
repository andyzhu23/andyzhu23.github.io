import { Link, useParams } from 'react-router-dom';
import { findBlogPost } from '../data/blogPosts';
import { parseBlogDate } from '../data/blogPosts/types';
import GiscusComments from '../components/GiscusComments';
import SEO from '../components/SEO';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? findBlogPost(slug) : undefined;

  if (!post) {
    return (
      <div className="page blog-post-page">
        <SEO title="Not found" description="That post doesn't exist." path={`/blog/${slug ?? ''}`} />
        <h1 className="page-title">Not found</h1>
        <p>That post doesn't exist (yet).</p>
        <Link to="/blog" className="blog-back-link">← Back to blog</Link>
      </div>
    );
  }

  const { Component } = post;
  const publishedISO = parseBlogDate(post.date).toISOString();
  const postUrl = `https://andyzhu23.github.io/blog/${post.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: publishedISO,
    dateModified: publishedISO,
    author: { '@type': 'Person', name: 'Andy Zhu', url: 'https://andyzhu23.github.io/' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    keywords: post.tags.join(', '),
  };

  return (
    <div className="page blog-post-page">
      <SEO
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        article={{ publishedTime: publishedISO, tags: post.tags, author: 'Andy Zhu' }}
        jsonLd={jsonLd}
      />
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
      <GiscusComments />
    </div>
  );
}
