export default function Blog() {
  return (
    <div className="page blog-page">
      <h1 className="page-title">Blog</h1>
      <div className="blog-empty card">
        <img src="/images/blog-photo.jpg" alt="Andy at the beach" className="blog-photo" />
        <h2>Coming Soon</h2>
        <p>
          I'm planning to write about competitive programming, systems design,
          and things I learn along the way. Stay tuned!
        </p>
      </div>
    </div>
  );
}
