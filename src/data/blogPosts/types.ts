import type { ComponentType } from 'react';

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readingMinutes: number;
}

export interface BlogPost extends BlogPostMeta {
  Component: ComponentType;
}

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

export function parseBlogDate(s: string): Date {
  const yearMatch = s.match(/\b(\d{4})\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : 0;
  const monthMatch = s.match(/January|February|March|April|May|June|July|August|September|October|November|December/i);
  const month = monthMatch ? MONTHS[monthMatch[0].toLowerCase()] : 0;
  const dayMatch = s.match(/\b(\d{1,2})\b/);
  const day = dayMatch ? parseInt(dayMatch[1], 10) : 1;
  return new Date(year, month, day);
}
