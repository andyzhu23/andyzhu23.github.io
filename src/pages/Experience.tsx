const experiences = [
  {
    company: 'Jump Trading',
    location: 'London, UK',
    role: 'Software Engineer Intern',
    date: 'June 2026 - September 2026',
    points: ['Incoming'],
    highlight: true,
  },
  {
    company: 'Meta',
    location: 'London, UK',
    role: 'Software Engineer Intern',
    date: 'June 2025 - September 2025',
    points: [
      'Built a debugging tool for outage automation, Meta\'s system of tracking network outages',
      'Embedded and captured API calls from existing services, stored them in MySQL and displayed them on UI',
      'Used Go for backend, PHP, React, and GraphQL for frontend, Thrift as IDL for sending API calls',
    ],
  },
  {
    company: 'Man Group',
    location: 'London, UK',
    role: 'Technology Summer Intern',
    date: 'June 2024 - September 2024',
    points: [
      'Built ETL and ELT pipelines using various tools such as Flyte, Dagster, and Airbyte within Man\'s infrastructure',
      'Gave a company-wide presentation comparing pros & cons of different tools explored, giving insights to potential solutions for next generation Man pipelines',
    ],
  },
];

export default function Experience() {
  return (
    <div className="page experience-page">
      <h1 className="page-title">Experience</h1>
      <div className="timeline">
        {experiences.map((exp, i) => (
          <div key={i} className={`timeline-item card ${exp.highlight ? 'highlight' : ''}`}>
            <div className="timeline-marker" />
            <div className="timeline-content">
              <div className="timeline-header">
                <div>
                  <h2>{exp.company}</h2>
                  <p className="subtitle">{exp.role}</p>
                  <p className="location">{exp.location}</p>
                </div>
                <span className="date">{exp.date}</span>
              </div>
              <ul>
                {exp.points.map((p, j) => <li key={j}>{p}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
