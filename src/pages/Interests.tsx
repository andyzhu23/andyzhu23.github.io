const cpProfiles = [
  { name: 'Codeforces', url: 'https://codeforces.com/profile/Wizard_of_Orz' },
  { name: 'LeetCode', url: 'https://leetcode.com/u/Wizard_of_Orz/' },
  { name: 'DMOJ', url: 'https://dmoj.ca/user' },
];

const contests = [
  { name: 'YAC 8', url: 'https://dmoj.ca/contest/yac8' },
  { name: 'SGSPC', url: 'https://dmoj.ca/contest/sgspc' },
  { name: 'ARC', url: 'https://dmoj.ca/contest/arc' },
];

export default function Interests() {
  return (
    <div className="page interests-page">
      <h1 className="page-title">Interests</h1>

      <section className="interest-section card">
        <h2>Competitive Programming</h2>
        <p>
          I've been doing competitive programming since high school. I'm a USACO Platinum
          contestant, CCO Bronze Medalist, and contest manager for the Cambridge Competitive
          Programming Society. I've also co-authored programming contests on DMOJ.
        </p>
        <h3>Profiles</h3>
        <div className="link-list">
          {cpProfiles.map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="link-chip">
              {p.name} ↗
            </a>
          ))}
        </div>
        <h3>Contests Authored</h3>
        <div className="link-list">
          {contests.map(c => (
            <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer" className="link-chip">
              {c.name} ↗
            </a>
          ))}
        </div>
      </section>

      <section className="interest-section card">
        <h2>Bridge</h2>
        <p>
          I enjoy playing contract bridge. I play regularly on Bridge Base Online and love
          the strategic depth of bidding conventions and card play.
        </p>
      </section>
    </div>
  );
}
