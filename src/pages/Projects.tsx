const projects = [
  {
    title: 'Implementation of Gap Amplification',
    date: 'October 2025 - May 2026',
    description: 'Studied and implemented Gap Amplification construction used in Dinur\'s proof of the PCP theorem.',
    url: undefined as string | undefined,
    points: [
      'Implemented the construction in C++',
      'Studied various error-correcting codes used in PCP of Proximity constructions',
      'Explored advanced topics such as Fast Reed-Solomon Interactive Oracle Proof (FRI) protocol',
      'Supervised by Professor Tom Gur at Cambridge',
    ],
    tags: ['C++', 'Theoretical CS', 'PCP Theorem'],
  },
  {
    title: 'Differential Analyser Simulator',
    date: 'January 2025 - March 2025',
    description: 'Collaborated with a team of Cambridge undergrads to create a simulator for the differential analyser.',
    url: 'https://differentialanalyser.github.io/',
    points: [
      'Focused on backend, built objects simulating various mechanical components with TypeScript',
      'Praised as the most impressive professional achievement out of 20 projects by the Cambridge Department of Computer Science and Technology',
      'Runner-up for the most impressive technical achievement',
      'Featured on the IEEE Annals of the History of Computing',
    ],
    tags: ['TypeScript', 'Simulation', 'Team Project'],
  },
];

export default function Projects() {
  return (
    <div className="page projects-page">
      <h1 className="page-title">Projects</h1>
      <div className="projects-grid">
        {projects.map((project, i) => (
          <div key={i} className="project-card card">
            <div className="project-header">
              <h2>
                {project.url ? (
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    {project.title} ↗
                  </a>
                ) : project.title}
              </h2>
              <span className="date">{project.date}</span>
            </div>
            <p className="project-description">{project.description}</p>
            <ul>
              {project.points.map((p, j) => <li key={j}>{p}</li>)}
            </ul>
            <div className="tag-list">
              {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
