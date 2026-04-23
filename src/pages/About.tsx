export default function About() {
  const skills = {
    'Languages': ['C++', 'Python', 'Java', 'Go', 'Julia', 'SQL', 'OCaml', 'PHP', 'Prolog'],
    'Frontend': ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'GraphQL'],
    'Tools & Frameworks': ['CMake', 'Thrift', 'Flyte', 'Dagster', 'Airbyte', 'Git'],
  };

  const courses = [
    'Digital Signal Processing', 'Machine Learning & Bayesian Inference', 'Deep Neural Networks', 'Compiler', 'Concurrent & Distributed Systems', 'Operating System', 'Databases', 'Data Science', 'Computer Networking', 'Computer Architecture', 'Algorithms',  'Cybersecurity', 'Cryptography', 'Quantum Computing', 'Bioinformatics', 'Information Theory', 'Complexity Theory', 'Programming Language Theory'
  ];

  return (
    <div className="page about-page">
      <h1 className="page-title">About Me</h1>
      <div className="about-grid">
        <section className="about-bio card">
          <div className="about-bio-inner">
            <img src="/images/profile.jpg" alt="Andy Zhu" className="profile-photo" />
            <div className="about-bio-text">
              <h2>Hello!</h2>
              <p>
                I'm Andy, a final-year Computer Science student at the University of Cambridge
                (Selwyn College), graduating in July 2026. Born in Montreal, Canada, I moved to Hangzhou, China
                as a kid, then back to Vancouver, Canada before coming to Cambridge for undergrad.
              </p>
              <p>
                I'm passionate about systems engineering, algorithms, and building tools that solve
                real problems. I'm an incoming software engineer intern at Jump Trading, and have previously interned at Meta
                and Man Group, working across backend systems, debugging infrastructure, and data
                pipelines. Outside of work, I'm a competitive programmer and contest author.
              </p>
            </div>
          </div>
        </section>

        <section className="about-education card">
          <h2>Education</h2>
          <div className="education-item">
            <h3>University of Cambridge</h3>
            <p className="subtitle">BA (Hons) Computer Science Tripos</p>
            <p className="date">Graduating July 2026</p>
          </div>
          <div className="education-item">
            <h3>St. George's School</h3>
            <p className="subtitle">Vancouver, Canada</p>
            <p className="date">September 2020 - June 2023</p>
          </div>
          <h3 className="courses-heading">Relevant Courses</h3>
          <div className="tag-list">
            {courses.map(c => <span key={c} className="tag">{c}</span>)}
          </div>
        </section>

        <section className="about-skills card">
          <h2>Technical Skills</h2>
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="skill-group">
              <h3>{category}</h3>
              <div className="tag-list">
                {items.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
          ))}
        </section>
        <section className="about-cv card">
          <h2>Curriculum Vitae</h2>
          <p>Download a PDF copy of my CV.</p>
          <a
            href={`${import.meta.env.BASE_URL}CV_Andy_Zhu.pdf`}
            download="Andy_Zhu_CV.pdf"
            className="cv-download"
          >
            <span className="cv-icon">PDF</span>
            <span className="cv-label">Download CV</span>
            <span className="cv-arrow">↓</span>
          </a>
        </section>

        <section className="about-socials card">
          <h2>Connect</h2>
          <div className="link-list">
            <a href="mailto:andy.zheyuan.zhu@gmail.com" className="link-chip">Email ↗</a>
            <a href="https://github.com/andyzhu23" target="_blank" rel="noopener noreferrer" className="link-chip">GitHub ↗</a>
            <a href="https://www.linkedin.com/in/andy-zhu-92409323b" target="_blank" rel="noopener noreferrer" className="link-chip">LinkedIn ↗</a>
            <a href="https://open.spotify.com/user/af656qa2tldyvmid9sbdzh9w2?si=b5521cb5445843bc" target="_blank" rel="noopener noreferrer" className="link-chip">Spotify ↗</a>
            <a href="https://www.instagram.com/littlenotorzzie" target="_blank" rel="noopener noreferrer" className="link-chip">Instagram ↗</a>
            <span className="link-chip discord-chip">Discord: Wizard_of_Orz</span>
          </div>
        </section>
      </div>
    </div>
  );
}
