export default function About() {
  const skills = {
    'Languages': ['C++', 'Python', 'Java', 'Go', 'Julia', 'SQL', 'OCaml', 'PHP', 'Prolog'],
    'Frontend': ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'GraphQL'],
    'Tools & Frameworks': ['CMake', 'Thrift', 'Flyte', 'Dagster', 'Airbyte', 'Git'],
  };

  const courses = [
    'Machine Learning', 'Deep Learning', 'Compiler Design', 'Cybersecurity',
    'Concurrent & Distributed Systems', 'Operating Systems', 'Databases',
    'Digital Signal Processing', 'Data Science', 'Networking', 'Cryptography',
  ];

  return (
    <div className="page about-page">
      <h1 className="page-title">About Me</h1>
      <div className="about-grid">
        <section className="about-bio card">
          <div className="about-bio-inner">
            <img src="/profile.jpg" alt="Andy Zhu" className="profile-photo" />
            <div className="about-bio-text">
              <h2>Hello!</h2>
              <p>
                I'm Andy, a final-year Computer Science student at the University of Cambridge
                (Selwyn College), graduating in July 2026. Born in Canada, I moved to Hangzhou, China
                as a kid, then back to Vancouver, Canada before coming to Cambridge for undergrad.
              </p>
              <p>
                I'm passionate about systems engineering, algorithms, and building tools that solve
                real problems. I'm incoming at Jump Trading, and have previously interned at Meta
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
            <p className="subtitle">BA (Hons) Computer Science Tripos &middot; Selwyn College</p>
            <p className="date">Graduating July 2026</p>
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
      </div>
    </div>
  );
}
