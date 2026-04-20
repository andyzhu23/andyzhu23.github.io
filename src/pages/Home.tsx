import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page home-page">
      <div className="home-hero">
        <h1 className="home-name">
          <span className="home-name-line">Andy</span>
          <span className="home-name-line">Zhu</span>
        </h1>
        <p className="home-chinese-name">朱哲远</p>
        <p className="home-tagline">
          Computer Science @ Cambridge &middot; Software Engineer
        </p>
        <div className="home-cta">
          <Link to="/about" className="btn btn-primary">About Me</Link>
          <Link to="/experience" className="btn btn-outline">Experience</Link>
        </div>
      </div>
    </div>
  );
}
