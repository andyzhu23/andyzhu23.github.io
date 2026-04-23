const cpProfiles = [
  { name: 'Codeforces', url: 'https://codeforces.com/profile/Wizard_of_Orz' },
  { name: 'LeetCode', url: 'https://leetcode.com/u/Wizard_of_Orz/' },
  { name: 'DMOJ', url: 'https://dmoj.ca/user/andy_zhu23' },
];

const contests = [
  { name: 'YAC 8', url: 'https://dmoj.ca/contest/yac8' },
  { name: 'SGSPC', url: 'https://dmoj.ca/contest/sgspc' },
  { name: 'ARC', url: 'https://dmoj.ca/contest/arc1' },
];

export default function Interests() {
  return (
    <div className="page interests-page">
      <h1 className="page-title">Interests</h1>

      <section className="interest-section card">
        <h2>Competitive Programming</h2>
        <p>
          I've been doing competitive programming since high school, and I am a co-author of programming contests on DMOJ.
        </p>
        <h3>University of Cambridge Competitive Programming Society</h3>
        <p>
          I served as contest manager in the 2024-25 academic year, helping create and
          run contests for the society. In 2025-26 I took on the role of treasurer, managing
          the society's finances.
        </p>
        <h3>Profiles</h3>
        <div className="link-list">
          {cpProfiles.map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="link-chip">
              {p.name} ↗
            </a>
          ))}
        </div>
        <h3>Contests Co-authored</h3>
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
          
          I was on the committee of the Cambridge University Bridge Club in 2025-26 as president.
        </p>
      </section>

      <section className="interest-section card">
        <h2>Super Smash Bros Ultimate</h2>
        <p>
          I used to grind smash back in the day. Lucina main, I secondary Mr. Game & Watch and King K. Rool.
        </p>
      </section>
    </div>
  );
}
