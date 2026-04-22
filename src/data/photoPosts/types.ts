export interface PhotoPost {
  id: string;
  title: string;
  date: string;
  location: string;
  caption: string;
  photos: string[];
}

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

export function parseSortDate(s: string): Date {
  const yearMatch = s.match(/\b(\d{4})\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : 0;

  const monthMatches = s.match(/January|February|March|April|May|June|July|August|September|October|November|December/gi) ?? [];
  const lastMonth = monthMatches.length > 0
    ? MONTHS[monthMatches[monthMatches.length - 1].toLowerCase()]
    : 11;

  const dayMatches = (s.match(/\b(\d{1,2})\b/g) ?? [])
    .map(n => parseInt(n, 10))
    .filter(n => n >= 1 && n <= 31);
  const lastDay = dayMatches.length > 0 ? Math.max(...dayMatches) : 28;

  return new Date(year, lastMonth, lastDay);
}
