import { useEffect, useState } from 'react';

interface CfUser {
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
}

const RANK_COLORS: Record<string, string> = {
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

function rankColor(rank: string): string {
  return RANK_COLORS[rank.toLowerCase()] ?? '#aaaaaa';
}

export default function CpRatingWidget() {
  const [cf, setCf] = useState<CfUser | null>(null);
  const [cfError, setCfError] = useState(false);

  useEffect(() => {
    fetch('https://codeforces.com/api/user.info?handles=Wizard_of_Orz')
      .then(r => r.json())
      .then(data => {
        if (data.status === 'OK') setCf(data.result[0]);
        else setCfError(true);
      })
      .catch(() => setCfError(true));
  }, []);

  return (
    <div className="cp-rating-widget">
      <div className="cp-rating-card">
        <div className="cp-rating-platform">Codeforces</div>
        {cf ? (
          <>
            <div className="cp-rating-number" style={{ color: rankColor(cf.rank) }}>
              {cf.rating}
            </div>
            <div className="cp-rating-rank" style={{ color: rankColor(cf.rank) }}>
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
    </div>
  );
}
