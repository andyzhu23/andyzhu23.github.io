import { useEffect, useState } from 'react';

interface CfUser {
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
}

interface LcContest {
  rating: number;
  attendedContestsCount: number;
  globalRanking: number;
  topPercentage: number;
  badge: { name: string } | null;
}

// DMOJ blocks cross-origin browser fetches behind a Cloudflare managed challenge,
// so values are baked in. Refresh from https://dmoj.ca/api/v2/user/andy_zhu23
// (data.object) when rating changes.
const DMOJ_STATIC = {
  rating: 2156,
  performance_points: 652,
  problem_count: 822,
};

const CF_RANK_COLORS: Record<string, string> = {
  'legendary grandmaster': '#ff0000',
  'international grandmaster': '#ff0000',
  'grandmaster': '#ff3333',
  'international master': '#ff8c00',
  'master': '#ff8c00',
  'candidate master': '#cc44cc',
  'expert': '#5599ff',
  'specialist': '#03c8be',
  'pupil': '#44bb44',
  'newbie': '#888888',
};

function cfRankColor(rank: string): string {
  return CF_RANK_COLORS[rank.toLowerCase()] ?? '#aaaaaa';
}

function lcTier(rating: number, badge: string | null): { label: string; color: string } {
  const color = '#5599ff';
  if (badge === 'Guardian') return { label: 'Guardian', color };
  if (badge === 'Knight') return { label: 'Knight', color };
  if (rating >= 2100) return { label: 'top 5%', color };
  if (rating >= 1800) return { label: 'top 10%', color };
  if (rating >= 1500) return { label: 'top 25%', color };
  return { label: '', color };
}

function dmojTier(rating: number): { label: string; color: string } {
  if (rating >= 3000) return { label: 'target', color: '#ff0000' };
  if (rating >= 2400) return { label: 'grandmaster', color: '#ee0000' };
  if (rating >= 1900) return { label: 'master', color: '#ffb100' };
  if (rating >= 1600) return { label: 'candidate master', color: '#a000a0' };
  if (rating >= 1300) return { label: 'expert', color: '#3333ff' };
  if (rating >= 1000) return { label: 'amateur', color: '#00a900' };
  return { label: 'newbie', color: '#999999' };
}

export default function CpRatingWidget() {
  const [cf, setCf] = useState<CfUser | null>(null);
  const [cfError, setCfError] = useState(false);
  const [lc, setLc] = useState<LcContest | null>(null);
  const [lcError, setLcError] = useState(false);

  useEffect(() => {
    fetch('https://codeforces.com/api/user.info?handles=Wizard_of_Orz')
      .then(r => r.json())
      .then(data => {
        if (data.status === 'OK') setCf(data.result[0]);
        else setCfError(true);
      })
      .catch(() => setCfError(true));

    fetch('https://alfa-leetcode-api.onrender.com/userContestRankingInfo/Wizard_of_Orz')
      .then(r => r.json())
      .then(data => {
        if (data?.userContestRanking) setLc(data.userContestRanking);
        else setLcError(true);
      })
      .catch(() => setLcError(true));
  }, []);

  const lcRating = lc ? Math.round(lc.rating) : 0;
  const lcInfo = lc ? lcTier(lcRating, lc.badge?.name ?? null) : null;
  const dmojInfo = dmojTier(DMOJ_STATIC.rating);

  return (
    <div className="cp-rating-widget">
      <div className="cp-rating-card">
        <div className="cp-rating-platform">Codeforces</div>
        {cf ? (
          <>
            <div className="cp-rating-number" style={{ color: cfRankColor(cf.rank) }}>
              {cf.rating}
            </div>
            <div className="cp-rating-rank" style={{ color: cfRankColor(cf.rank) }}>
              {cf.rank}
            </div>
            <div className="cp-rating-max">peak {cf.maxRating} · {cf.maxRank}</div>
          </>
        ) : cfError ? (
          <div className="cp-rating-unavailable">unavailable</div>
        ) : (
          <div className="cp-rating-loading">loading…</div>
        )}
      </div>

      <div className="cp-rating-card">
        <div className="cp-rating-platform">LeetCode</div>
        {lc && lcInfo ? (
          <>
            <div className="cp-rating-number" style={{ color: lcInfo.color }}>
              {lcRating}
            </div>
            <div className="cp-rating-rank" style={{ color: lcInfo.color }}>
              {lcInfo.label || ' '}
            </div>
            <div className="cp-rating-max">
              global #{lc.globalRanking.toLocaleString()} · {lc.attendedContestsCount} contests
            </div>
          </>
        ) : lcError ? (
          <div className="cp-rating-unavailable">unavailable</div>
        ) : (
          <div className="cp-rating-loading">loading…</div>
        )}
      </div>

      <div className="cp-rating-card">
        <div className="cp-rating-platform">DMOJ</div>
        <div className="cp-rating-number" style={{ color: dmojInfo.color }}>
          {DMOJ_STATIC.rating}
        </div>
        <div className="cp-rating-rank" style={{ color: dmojInfo.color }}>
          {dmojInfo.label}
        </div>
        <div className="cp-rating-max">
          {DMOJ_STATIC.problem_count} solved · {Math.round(DMOJ_STATIC.performance_points)} pp
        </div>
      </div>
    </div>
  );
}
